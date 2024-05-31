import { Args, Query, Resolver } from '@nestjs/graphql';

import { EmailDto } from '../auth/dto/auth.dto';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUserByEmail(@Args('emailDto') emailDto: EmailDto): Promise<User> {
    return this.userService.getUserByEmail(emailDto.email);
  }
}
