import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  protected readonly logger = new Logger(UserService.name);
  constructor(
    @Inject('USER_RMQ_MS') private readonly userRMQClient: ClientProxy,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await firstValueFrom(
        this.userRMQClient.send<User, any>('get-user-by-email', { email }),
      );
    } catch (error) {
      this.logger.error(
        `Error: code ${error.status || 500} - ${error.message}`,
      );
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
