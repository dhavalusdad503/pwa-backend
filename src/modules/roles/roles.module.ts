import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { QueryBuilderModule } from '@common/utils/queryBuilder/queryBuilder.module';

@Module({
  imports: [QueryBuilderModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [QueryBuilderModule]
})
export class RolesModule {}
