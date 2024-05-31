import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusResponseDto } from './dto/status-response.dto';
import { User } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  protected readonly logger = new Logger(UserController.name);

  @MessagePattern('get-user-by-email')
  getUserByEmail({ email }: { email: string }): Promise<User> {
    this.logger.log('Received getUserByEmail request');
    return this.userService.getUserByEmail(email);
  }

  @MessagePattern('get-user-by-id')
  getUserById({ id }: { id: string }): Promise<User> {
    this.logger.log('Received getUserById request');
    return this.userService.getUserById(id);
  }

  @MessagePattern('update-user')
  updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log('Received updateUser request');
    return this.userService.update(updateUserDto);
  }

  @MessagePattern('delete-user')
  deleteUser({ id }: { id: string }): Promise<StatusResponseDto> {
    this.logger.log('Received deleteUser request');
    return this.userService.remove(id);
  }

  @MessagePattern('confirm-password')
  confirmPassword(passwordDto: {
    id: string;
    password: string;
  }): Promise<StatusResponseDto> {
    this.logger.log('Received confirmPassword request');
    return this.userService.confirmPassword(passwordDto);
  }

  @MessagePattern('change-password')
  changePassword(passwordDto: {
    id: string;
    password: string;
  }): Promise<StatusResponseDto> {
    this.logger.log('Received changePassword request');
    return this.userService.changePassword(passwordDto);
  }
}
