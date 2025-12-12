import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Patient } from '../patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, Organization, Patient])],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
