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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
