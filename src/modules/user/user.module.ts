import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryBuilderService } from '@common/utils/queryBuilder/queryBuilder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, QueryBuilderService],
})
export class UserModule {}
