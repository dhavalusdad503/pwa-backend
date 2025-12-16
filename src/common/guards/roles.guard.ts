import { DECORATOR_ROLES_KEY, Roles } from '@common/constants';
import { User } from '@modules/user/entities/user.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      DECORATOR_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('Access Denied');
    }

    const exists = await this.userRepository.exists({
      where: {
        id: user.id,
        role: { slug: In(requiredRoles) },
      },
      relations: ['role'],
    });

    if (!exists) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
