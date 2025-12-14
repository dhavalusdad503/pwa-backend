import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VisitModule } from './modules/visit/visit.module';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { PatientModule } from './modules/patient/patient.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configStore } from './config/app.config';
import { generateDataSourceOptions } from './config/type-orm/type-orm.config';
import { Entities } from './config/type-orm/entities';
import { IDbOptions } from './common/types';
import { MailModule } from './shared/mail/mail.module';
import { CommonModule } from './common/common.module';
import { LoggerModule } from './common/logger/logger.module';

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
    LoggerModule,
    CommonModule,
    MailModule,
    AuthModule,
    VisitModule,
    OrganizationModule,
    PatientModule,
    RolesModule,
    UserModule,
  ],
})
export class AppModule {}
