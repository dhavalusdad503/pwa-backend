import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthTokenPayload } from '@common/types';

export const User = createParamDecorator(
  (
    data: unknown,
    ctx: ExecutionContext,
  ): Partial<AuthTokenPayload> | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
