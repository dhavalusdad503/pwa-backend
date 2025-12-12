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
  @IsUUID()
  orgId: string;

  @IsUUID()
  caregiverId: string;

  @IsUUID()
  patientId: string;

  // Timestamps
  @IsDateString()
  startedAt: Date;

  @IsDateString()
  endedAt: Date;

  @IsOptional()
  @IsDateString()
  submittedAt?: Date;

  // Visit details
  @IsString()
  address: string;

  @IsBoolean()
  attestation: boolean;

  @IsString()
  attestationName: string;

  @IsOptional()
  @IsBoolean()
  followUp: boolean;

  @IsOptional()
  @IsBoolean()
  clientPresent: boolean;

  @IsOptional()
  @IsBoolean()
  medicationReviewed: boolean;

  @IsOptional()
  @IsBoolean()
  safetyCheck: boolean;

  @IsString()
  patientName: string;

  @IsString()
  notes: string;

  @IsString()
  serviceType: string;

  // Geo
  @IsNumber()
  latitude: number;

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
}
