import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgUserDto } from './create-org-user.dto';

export class UpdateOrgUserDto extends PartialType(CreateOrgUserDto) {}
