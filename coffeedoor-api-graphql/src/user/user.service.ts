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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, IdDto>('get-user-by-id', { id }),
      );
    } catch (error) {
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async deleteUser(id: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<StatusResponse, IdDto>('delete-user', { id }),
      );
    } catch (error) {
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
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
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
