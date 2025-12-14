import 'dotenv/config';
import { IJwtOptions } from '@/common/types';
import { JwtModuleOptions } from '@nestjs/jwt';
import { parseInt } from '@/common/utils';

export const jwtConfig = (option?: IJwtOptions): JwtModuleOptions => {
  const jwtConfiguration: JwtModuleOptions = {
    secret: option?.jwtSecret ?? process.env.JWT_SECRET ?? 'defaultSecretKey',
    signOptions: {
      expiresIn: parseInt(
        option?.jwtExpiresIn ?? process.env.JWT_EXPIRES_IN ?? '1h',
      ),
    },
  };

  return jwtConfiguration;
};
