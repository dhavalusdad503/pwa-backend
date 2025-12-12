import { IsEmail, IsEnum, IsString, IsNotEmpty, IsOptional } from "class-validator";
import { AuthProvider, UserStatus } from "../entities/user.entity";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  authProvider: AuthProvider;

  @IsOptional() //temorary
  roleId?: string;
}
