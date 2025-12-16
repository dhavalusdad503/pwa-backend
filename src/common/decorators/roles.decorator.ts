import { DECORATOR_ROLES_KEY, Roles } from '@common/constants';
import { SetMetadata } from '@nestjs/common';

export const RolesDecorator = (...roles: Roles[]) =>
  SetMetadata(DECORATOR_ROLES_KEY, roles);
