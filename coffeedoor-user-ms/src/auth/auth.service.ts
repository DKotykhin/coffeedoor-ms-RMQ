import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { UserService } from '../user/user.service';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { User } from '../user/entities/user.entity';
import { StatusResponseDto } from '../user/dto/status-response.dto';

import { EmailConfirm } from './entities/email-confirm.entity';
import { ResetPassword } from './entities/reset-password.entity';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(EmailConfirm)
    private readonly emailConfirmRepository: Repository<EmailConfirm>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordHashService: PasswordHashService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  private cryptoToken(): string {
    const buffer = crypto.randomBytes(16);
    if (!buffer)
      throw new RpcException({
        message: 'Token error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    const token = buffer.toString('hex');
    return token;
  }

  private emailConfirmation({ to, token }: { to: string; token: string }) {
    return this.mailSenderService.sendMail({
      to,
      subject: 'Email confirmation',
      html: `
              <h2>Please, follow the link to confirm your email</h2>
              <h4>The link will expire within <strong>1 hour</strong></h4>
              <h4>If you don't try to login or register, ignore this mail</h4>
              <hr/>
              <br/>
              <a href='${this.configService.get('FRONTEND_URL')}/confirm-email/${token}'>Link for email confirmation</a>
            `,
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password, userName } = signUpDto;
    const candidate = await this.userService.getUserByEmailWithRelations(email);
    if (candidate && candidate.isVerified) {
      throw new RpcException({
        message: 'User with this email already exists',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    if (candidate && !candidate.isVerified) {
      throw new RpcException({
        message: 'Email not confirmed',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const token = this.cryptoToken();
    this.emailConfirmation({ to: email, token });

    const passwordHash = await this.passwordHashService.create(password);
    const user = await this.userService.create({
      email,
      passwordHash,
      userName,
    });
    try {
      await this.emailConfirmRepository.save({
        user,
        token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        message: 'Error while creating email confirm',
        status: HttpStatus.FORBIDDEN,
      });
    }

    return user;
  }

  async signIn({ email, password }: SignInDto): Promise<User> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw new RpcException({
        message: 'Incorrect login or password',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    await this.passwordHashService.compare(password, user.passwordHash);

    if (!user.isVerified) {
      if (user.emailConfirm?.expiredAt < new Date()) {
        const token = this.cryptoToken();
        this.emailConfirmation({ to: email, token });
      }
      throw new RpcException({
        message: 'Email not confirmed',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return user;
  }

  async confirmEmail(token: string): Promise<StatusResponseDto> {
    const emailConfirm = await this.emailConfirmRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!emailConfirm) {
      throw new RpcException({
        message: 'Invalid token',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    if (new Date() > new Date(emailConfirm.expiredAt)) {
      throw new RpcException({
        message: 'Token expired',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    try {
      await this.userService.update({
        id: emailConfirm.user.id,
        isVerified: true,
      });
      await this.emailConfirmRepository.update(emailConfirm.id, {
        verifiedAt: new Date(),
        token: null,
        expiredAt: null,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        message: 'Error while confirming email',
        status: HttpStatus.FORBIDDEN,
      });
    }

    return {
      status: true,
      message: 'Email successfully confirmed',
    };
  }

  async resendEmail(email: string): Promise<StatusResponseDto> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    if (user.isVerified) {
      throw new RpcException({
        message: 'Email already confirmed',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    if (user.emailConfirm?.expiredAt < new Date()) {
      const token = this.cryptoToken();
      this.emailConfirmation({ to: email, token });
      await this.emailConfirmRepository.update(user.emailConfirm.id, {
        token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      });
    } else {
      this.emailConfirmation({ to: email, token: user.emailConfirm.token });
    }
    return {
      status: true,
      message: 'Email confirmation link sent to your email',
    };
  }

  async resetPassword(email: string): Promise<StatusResponseDto> {
    const user = await this.userService.getUserByEmailWithRelations(email);
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    if (!user.resetPassword?.id || user.resetPassword?.expiredAt < new Date()) {
      const token = this.cryptoToken();
      this.mailSenderService.sendMail({
        to: user.email,
        subject: 'Reset password',
        html: `
                <h2>Please, follow the link to set new password</h2>
                <h4>The link will expire within <strong>1 hour</strong></h4>
                <h4>If you don't restore your password ignore this mail</h4>
                <hr/>
                <br/>
                <a href='${this.configService.get('FRONTEND_URL')}/reset-password/${token}'>Link for email confirmation</a>
              `,
      });
      try {
        await this.resetPasswordRepository
          .createQueryBuilder()
          .insert()
          .values({
            token,
            expiredAt: new Date(Date.now() + 1000 * 60 * 60),
            user,
          })
          .orUpdate(['token', 'expiredAt'], ['userId'])
          .execute();
      } catch (error) {
        this.logger.error(error.message);
        throw new RpcException({
          message: 'Error while resetting password',
          status: HttpStatus.FORBIDDEN,
        });
      }
    } else {
      this.mailSenderService.sendMail({
        to: user.email,
        subject: 'Reset password',
        html: `
                <h2>Please, follow the link to set new password</h2>
                <h4>!Repeated letter!</h4>
                <h4>If you don't restore your password ignore this mail</h4>
                <hr/>
                <br/>
                <a href='${this.configService.get('FRONTEND_URL')}/set-new-password/${user.resetPassword.token}'>Link for email confirmation</a>
              `,
      });
    }
    return {
      status: true,
      message: 'Password reset link sent to your email',
    };
  }

  async setNewPassword(
    token: string,
    password: string,
  ): Promise<StatusResponseDto> {
    const resetPassword = await this.resetPasswordRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!resetPassword) {
      throw new RpcException({
        message: 'Invalid token',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    if (new Date() > new Date(resetPassword.expiredAt)) {
      throw new RpcException({
        message: 'Token expired',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    try {
      const passwordHash = await this.passwordHashService.create(password);
      await this.userService.update({
        id: resetPassword.user.id,
        passwordHash,
      });
      await this.resetPasswordRepository.update(resetPassword.id, {
        isUsed: new Date(),
        token: null,
        expiredAt: null,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException({
        message: 'Error while setting new password',
        status: HttpStatus.FORBIDDEN,
      });
    }

    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
