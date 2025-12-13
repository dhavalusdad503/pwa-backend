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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configStore } from './config/app.config';
import { IDbOptions } from './config/type-orm/options';
import { generateDataSourceOptions } from './config/type-orm/type-orm.config';
import { Entities } from './config/type-orm/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configStore],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const opts = configService.get<IDbOptions>('database');
        return {
          ...generateDataSourceOptions(opts),
          autoLoadEntities: true,
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([...Entities]),
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
