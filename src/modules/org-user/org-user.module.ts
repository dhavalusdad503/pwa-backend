import { Module } from '@nestjs/common';
import { OrgUserService } from './org-user.service';
import { OrgUserController } from './org-user.controller';

@Module({
  controllers: [OrgUserController],
  providers: [OrgUserService],
})
export class OrgUserModule {}
