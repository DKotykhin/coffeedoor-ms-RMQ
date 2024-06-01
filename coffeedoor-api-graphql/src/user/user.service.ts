import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { EmailDto } from '../auth/dto/auth.dto';
import { IdDto, StatusResponse } from '../common/_index';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  protected readonly logger = new Logger(UserService.name);
  constructor(
    @Inject('USER_RMQ_MS') private readonly userRMQClient: ClientProxy,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, EmailDto>('get-user-by-email', { email }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: getUserByEmail',
      });
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, IdDto>('get-user-by-id', { id }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: getUserById',
      });
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, UpdateUserDto>('update-user', {
          id,
          ...updateUserDto,
        }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: updateUser',
      });
    }
  }

  async deleteUser(id: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, IdDto>('delete-user', { id }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: deleteUser',
      });
    }
  }

  async confirmPassword(id: string, password: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<
          StatusResponse,
          { id: string; password: string }
        >('confirm-password', { id, password }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: confirmPassword',
      });
    }
  }

  async changePassword(id: string, password: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<
          StatusResponse,
          { id: string; password: string }
        >('change-password', { id, password }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'UserService: changePassword',
      });
    }
  }
}
