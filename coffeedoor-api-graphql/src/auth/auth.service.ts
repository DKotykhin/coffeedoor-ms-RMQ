import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

import { User } from '../user/entities/user.entity';
import { StatusResponse } from '../common/_index';

import { EmailDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { SignInResponse } from './entities/sign-in-response.entity';
import { JwtPayload } from './dto/jwtPayload.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('USER_RMQ_MS') private readonly userRMQClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, SignUpDto>('sign-up', signUpDto),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: signUp',
      });
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    try {
      const user = await firstValueFrom(
        this.userRMQClient.send<User, SignInDto>('sign-in', signInDto),
      );
      const payload: JwtPayload = { email: user.email };
      const auth_token = this.jwtService.sign(payload);
      this.logger.debug(`auth_token: ${auth_token}`);
      return { user, token: auth_token };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: signIn',
      });
    }
  }

  async confirmEmail(token: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, { token: string }>(
          'confirm-email',
          { token },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: confirmEmail',
      });
    }
  }

  async resendEmail(emailDto: EmailDto): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, EmailDto>(
          'resend-email',
          emailDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: resendEmail',
      });
    }
  }

  async resetPassword(emailDto: EmailDto): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, EmailDto>(
          'reset-password',
          emailDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: resetPassword',
      });
    }
  }

  async setNewPassword(
    newPasswordDto: NewPasswordDto,
  ): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, NewPasswordDto>(
          'set-new-password',
          newPasswordDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: setNewPassword',
      });
    }
  }
}
