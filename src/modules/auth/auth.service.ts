import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtTokenService } from './jwt-token.service';
import * as bcrypt from 'bcrypt';
import { LoginUserResponse } from './auth.type';
import { OrganizationService } from '../organization/organization.service';
import { DEFAULT_ORGANIZATION_NAME } from '@/common/constants';
import { successResponse } from '@/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(user: CreateUserDto) {
    const userByEmail = await this.userService.findUserByEmail(user.email);

    if (userByEmail) {
      throw new UnauthorizedException('User already exists');
    }
    user.roleId = '5f0c0b4d-6c3d-4f0c-9a89-9f7e3ccaa4b1'; //temporary
    const newUser = await this.userService.create(user);

    if (!newUser) {
      throw new InternalServerErrorException('Something went wrong');
    }

    const token = this.jwtTokenService.createJWTToken({
      email: newUser.email,
      role: newUser.role.name,
      id: newUser.id,
      role_id: newUser.roleId,
    });

    const createdUser = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role.name,
    };

    return {
      message: 'User registered successfully',
      user: createdUser,
      token,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginUserResponse | null> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const responseUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? null,
      roleId: user.roleId ?? null,
      role: user.role
        ? {
            id: user.roleId,
            name: user.role.name,
            slug: user.role.slug,
          }
        : null,
    };

    return responseUser;
  }

  async validateOrganization(orgId?: string) {
    if (!orgId) {
      const organization = await this.organizationService.findByName(
        DEFAULT_ORGANIZATION_NAME,
      );
      if (!organization) return null;
      orgId = organization?.id;
    } else {
      const organization = await this.organizationService.findById(orgId);
      if (!organization) return null;
    }
    return orgId;
  }

  login(user: LoginUserResponse, orgId?: string) {
    const authTokenPayload = {
      id: user?.id,
      email: user?.email,
      role: user?.role?.slug,
      role_id: user?.roleId ?? user?.role?.id,
      org_id: orgId,
    };

    const token = this.jwtTokenService.createJWTToken(authTokenPayload);
    const refreshToken =
      this.jwtTokenService.createJWTRefreshToken(authTokenPayload);

    return successResponse(
      { token, refreshToken, user },
      'Login successfully!',
    );
  }

  refreshToken(refreshToken: string) {
    const decodedToken = this.jwtTokenService.verifyJWTToken(refreshToken);
    if (!decodedToken) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    const tokenPayload = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
      role_id: decodedToken.role_id,
      org_id: decodedToken.org_id,
    };

    const token = this.jwtTokenService.createJWTToken(tokenPayload);
    return successResponse(
      { token, refreshToken },
      'Access token generated successfully',
    );
  }
}
