import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { StatusResponse } from '../common/_index';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { SignInResponse } from './entities/sign-in-response.entity';
import { EmailDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  getUserByToken(@GetUser() user: User): User {
    return user;
  }

  @Mutation(() => User)
  signUp(@Args('signUpDto') signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Mutation(() => SignInResponse)
  signIn(@Args('signInDto') signInDto: SignInDto): Promise<SignInResponse> {
    return this.authService.signIn(signInDto);
  }

  @Mutation(() => StatusResponse)
  confirmEmail(@Args('token') token: string): Promise<StatusResponse> {
    return this.authService.confirmEmail(token);
  }

  @Mutation(() => StatusResponse)
  resendEmail(@Args('emailDto') emailDto: EmailDto): Promise<StatusResponse> {
    return this.authService.resendEmail(emailDto);
  }

  @Mutation(() => StatusResponse)
  resetPassword(@Args('emailDto') emailDto: EmailDto): Promise<StatusResponse> {
    return this.authService.resetPassword(emailDto);
  }

  @Mutation(() => StatusResponse)
  setNewPassword(
    @Args('newPasswordDto') newPasswordDto: NewPasswordDto,
  ): Promise<StatusResponse> {
    return this.authService.setNewPassword(newPasswordDto);
  }
}
