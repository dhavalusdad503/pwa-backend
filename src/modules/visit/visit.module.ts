import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@modules/organization/entities/organization.entity';
import { Patient } from '@modules/patient/entities/patient.entity';
import { Visit } from './entities/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, Organization, Patient])],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
