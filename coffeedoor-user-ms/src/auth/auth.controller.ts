import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { User } from '../user/entities/user.entity';
import { StatusResponseDto } from '../user/dto/status-response.dto';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  protected readonly logger = new Logger(AuthController.name);

  @MessagePattern('sign-up')
  signUp(signUpDto: SignUpDto): Promise<User> {
    this.logger.log('Received SignUp request');
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('sign-in')
  signIn(signInDto: SignInDto): Promise<User> {
    this.logger.log('Received SignIn request');
    return this.authService.signIn(signInDto);
  }

  @MessagePattern('confirm-email')
  confirmEmail({ token }: { token: string }): Promise<StatusResponseDto> {
    this.logger.log('Received ConfirmEmail request');
    return this.authService.confirmEmail(token);
  }

  @MessagePattern('resend-email')
  resendEmail({ email }: { email: string }): Promise<StatusResponseDto> {
    this.logger.log('Received ResendEmail request');
    return this.authService.resendEmail(email);
  }

  @MessagePattern('reset-password')
  resetPassword({ email }: { email: string }): Promise<StatusResponseDto> {
    this.logger.log('Received ResetPassword request');
    return this.authService.resetPassword(email);
  }

  @MessagePattern('set-new-password')
  setNewPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<StatusResponseDto> {
    this.logger.log('Received SetNewPassword request');
    return this.authService.setNewPassword(token, password);
  }
}
