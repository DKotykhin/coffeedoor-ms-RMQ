import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtTokenConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: configService.get('JWT_SECRET_KEY'),
  signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
});
