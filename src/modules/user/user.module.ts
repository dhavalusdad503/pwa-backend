import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryBuilderModule } from '@common/utils/queryBuilder/queryBuilder.module';
import { Role } from '@modules/roles/entities/role.entity';
import { OrgUser } from '@modules/org-user/entities/org-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, OrgUser]),
    QueryBuilderModule
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule { }
