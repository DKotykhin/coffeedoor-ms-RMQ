import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';

import { JwtPayload } from '../dto/jwtPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED, {
        cause: 'JwtStrategy:validate',
      });
    }

    return user;
  }
}
