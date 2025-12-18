import { Module } from '@nestjs/common';
import { QueryBuilderService } from './queryBuilder.service';

@Module({
  providers: [QueryBuilderService],
  exports: [QueryBuilderService],
})
export class QueryBuilderModule { }
