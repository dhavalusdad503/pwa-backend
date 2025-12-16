import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@common/decorators';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import type { AuthTokenPayload } from '@common/types';
import { Roles } from '@common/constants';
import { paginationOption } from '@common/utils';
import { RolesGuard } from '@common/guards/roles.guard';
import { RolesDecorator } from '@common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.userService.create(createUserDto);
  }

  @RolesDecorator(Roles.ADMIN, Roles.SUPERVISOR)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@User() user: AuthTokenPayload, @Query() query) {
    const { role, org_id } = user;

    if (!org_id || !role) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.userService.findAll(user, paginationOption(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
