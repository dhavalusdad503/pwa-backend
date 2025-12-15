import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrgUserService } from './org-user.service';
import { CreateOrgUserDto } from './dto/create-org-user.dto';
import { UpdateOrgUserDto } from './dto/update-org-user.dto';

@Controller('org-user')
export class OrgUserController {
  constructor(private readonly orgUserService: OrgUserService) {}

  @Post()
  create(@Body() createOrgUserDto: CreateOrgUserDto) {
    return this.orgUserService.create(createOrgUserDto);
  }

  @Get()
  findAll() {
    return this.orgUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgUserDto: UpdateOrgUserDto) {
    return this.orgUserService.update(+id, updateOrgUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgUserService.remove(+id);
  }
}
