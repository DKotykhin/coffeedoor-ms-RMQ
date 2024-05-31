import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtTokenConfig } from '../config/jwt-token.config';
import { userRmqConfig } from '../config/rmq.config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ClientsModule.registerAsync([userRmqConfig]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtTokenConfig,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthResolver, AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
