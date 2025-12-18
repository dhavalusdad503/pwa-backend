import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  DEFAULT_ORGANIZATION_NAME,
  RESET_PASS_TOKEN_EXPIRY_MINUTES,
  UserStatus,
} from '@common/constants';
import { combineName, decrypt, encrypt, successResponse } from '@common/utils';
import { UserService } from '@modules/user/user.service';
import { OrganizationService } from '@modules/organization/organization.service';
import { JwtTokenService } from './jwt-token.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { LoginUserResponse } from './auth.type';
import { addMinutes } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@shared/mail/mail.service';
import { ResetPasswordDto } from './dto/index.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // async register(user: CreateUserDto) {
  //   const userByEmail = await this.userService.findUserByEmail(user.email);

  //   if (userByEmail) {
  //     throw new UnauthorizedException('User already exists');
  //   }
  //   // user.roleId = '5f0c0b4d-6c3d-4f0c-9a89-9f7e3ccaa4b1'; //temporary
  //   const newUser = await this.userService.create(user);

  //   if (!newUser) {
  //     throw new InternalServerErrorException('Something went wrong');
  //   }

  //   const token = this.jwtTokenService.createJWTToken({
  //     email: newUser.email,
  //     role: newUser.role.name,
  //     id: newUser.id,
  //     role_id: newUser.roleId,
  //   });

  //   const createdUser = {
  //     email: newUser.email,
  //     firstName: newUser.firstName,
  //     lastName: newUser.lastName,
  //     phone: newUser.phone,
  //     role: newUser.role.name,
  //   };

  //   return {
  //     message: 'User registered successfully',
  //     user: createdUser,
  //     token,
  //   };
  // }

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

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email, {
      select: ['id', 'email', 'firstName', 'lastName', 'status'],
    });

    if (user?.status !== UserStatus.ACTIVE) {
      throw new HttpException('User is not active', HttpStatus.BAD_REQUEST);
    }

    const { id, firstName, lastName } = user;

    const token = encrypt(
      JSON.stringify({
        id,
        email,
        tokenExpiryDate: addMinutes(
          new Date(),
          RESET_PASS_TOKEN_EXPIRY_MINUTES,
        ),
      }),
    );

    await this.userService.update(id, { resetPassToken: token });
    const redirectUrl = `${this.configService.get('frontendUrl')}/reset-password?token=${token}`;

    const name = combineName({ names: [firstName, lastName] });
    await this.mailService.sendForgotPasswordMail(email, name, redirectUrl);

    return successResponse(null, 'Password reset link sent to your email');
  }

  async validateToken(token: string) {
    const tokenDetails = decrypt(token);
    const tokenObj: { id: string; email: string; tokenExpiryDate: Date } =
      tokenDetails && JSON.parse(tokenDetails);

    if (!tokenObj) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne(tokenObj.id, {
      select: ['resetPassToken'],
    });

    if (!user?.resetPassToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const tokenExpiryDate = new Date(tokenObj?.tokenExpiryDate);
    const now = new Date();
    const isValidateToken = now < tokenExpiryDate;

    if (!isValidateToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    return successResponse({ isValid: isValidateToken });
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, new_password } = data;
    const tokenDetails = decrypt(token);
    const tokenObj: { id: string; email: string; tokenExpiryDate: Date } =
      tokenDetails && JSON.parse(tokenDetails);

    if (!tokenObj) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const { id, tokenExpiryDate } = tokenObj;
    if (new Date() > new Date(tokenExpiryDate)) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne(id, {
      relations: ['role'],
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'resetPassToken',
        'password',
      ],
    });

    const storedToken = decodeURIComponent(user?.resetPassToken || '');
    if (!user?.resetPassToken || (storedToken && storedToken !== token)) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    if (user.password) {
      const isSamePassword = await bcrypt.compare(new_password, user.password);
      if (isSamePassword) {
        throw new HttpException(
          'Your current and previous password could not be same',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const orgId = await this.validateOrganization();
    if (!orgId)
      throw new HttpException('Organization not found', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.userService.update(id, {
      resetPassToken: null,
      password: hashedPassword,
    });

    const loginUser = {
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

    const loginResponse = this.login(loginUser, orgId);

    return loginResponse;
  }
}
