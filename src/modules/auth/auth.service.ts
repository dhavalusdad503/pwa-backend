import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/index.dto';
import { UserService } from '../user/user.service';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtTokenService: JwtTokenService
  ) {}

  async register(user: CreateUserDto) {

    const userByEmail = await this.userService.findUserByEmail(user.email);

    if (userByEmail) {
      throw new UnauthorizedException('User already exists');
    }
    user.roleId = '5f0c0b4d-6c3d-4f0c-9a89-9f7e3ccaa4b1'; //temporary
    const newUser = await this.userService.create(user);

    if(!newUser){
      throw new InternalServerErrorException('Something went wrong');
    }
    
    const token = this.jwtTokenService.createJWTToken({
      email: newUser.email,
      role: newUser.role.name,
    });

    const createdUser = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role.name,
    }

    return {
      message: 'User registered successfully',
      user: createdUser,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = this.jwtTokenService.createJWTToken({
      email: user.email,
      role: user.role.name,
    });

    return {
      success: true,
      message: 'User logged in successfully',
      token,
    };
  }
}
