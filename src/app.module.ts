import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VisitModule } from './modules/visit/visit.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { PatientModule } from './modules/patient/patient.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { Visit } from './modules/visit/entities/visit.entity';
import { Organization } from './modules/organization/entities/organization.entity';
import { OrgUser } from './modules/org-user/entities/org-user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { Patient } from './modules/patient/entities/patient.entity';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      database: process.env.DB_NAME || 'test',
      password: process.env.DB_PASSWORD || 'Dev@root',
      // synchronize: true,
      entities: [User, Visit, Organization, OrgUser, Role, Patient],
      logging: true,
    }),
    AuthModule,
    VisitModule,
    OrganizationModule,
    PatientModule,
    RolesModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
