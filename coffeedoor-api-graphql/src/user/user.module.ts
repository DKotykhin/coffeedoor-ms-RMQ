import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { userRmqConfig } from '../config/rmq.config';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [ClientsModule.registerAsync([userRmqConfig])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
