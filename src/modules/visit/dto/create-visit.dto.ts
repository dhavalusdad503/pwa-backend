import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateVisitDto {
  // Foreign Keys
  @IsOptional()
  @IsUUID()
  orgId: string;

  @IsOptional()
  @IsUUID()
  caregiverId: string;

  @IsOptional()
  @IsUUID()
  patientId: string;

  // Timestamps
  @IsDateString()
  startedAt: Date;

  @IsDateString()
  endedAt: Date;

  @IsDateString()
  submittedAt?: Date;

  // Visit details
  @IsString()
  address: string;

  @Type(() => Boolean)
  @IsBoolean()
  attestation: boolean;

  @IsString()
  attestationName: string;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  followUp: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  clientPresent: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  medicationReviewed: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  safetyCheck: boolean;

  @IsString()
  patientName: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsString()
  serviceType: string;

  // Geo
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  // File path (after upload)
  @IsOptional()
  @IsString()
  filePath?: string;

  // Optional: temp visit ID from app
  @IsOptional()
  @IsNumber()
  tempId?: number;

  @IsString()
  orgName: string;

  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  path?: string;
}
