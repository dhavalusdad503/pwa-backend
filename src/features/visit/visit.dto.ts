import { joiCommon } from "@helper/joi-schema.helper";
import Joi from "joi";

export const createVisitSchema = Joi.object({
  startedAt: joiCommon.joiDate.optional(),
  endedAt: joiCommon.joiDate.optional(),
  notes: joiCommon.joiString.optional(),
  serviceType: joiCommon.joiString.optional(),
  submittedAt: joiCommon.joiDate.optional(),
  address: joiCommon.joiString.optional(),
  patientName: joiCommon.joiString.required(),
  attestation: joiCommon.joiBoolean.required(),
  attestationName: joiCommon.joiString.required(),
  followUp: joiCommon.joiBoolean.optional(),
  clientPresent: joiCommon.joiBoolean.optional(),
  safetyCheck: joiCommon.joiBoolean.optional(),
  medicationReviewed: joiCommon.joiBoolean.optional(),
  latitude: joiCommon.joiNumber.optional(),
  longitude: joiCommon.joiNumber.optional(),
  orgName: joiCommon.joiString.required()
});

export const updateVisitSchema = Joi.object({
  patientId: joiCommon.joiString.uuid().optional(),
  startedAt: joiCommon.joiDate.optional(),
  endedAt: joiCommon.joiDate.optional(),
  submittedAt: joiCommon.joiDate.optional(),
  serviceType: joiCommon.joiString.optional(),
  notes: joiCommon.joiString.optional(),
});

export interface CreateVisitDto {
  startedAt: Date;
  endedAt: Date;
  tempId?: number;
  address: string;
  attestation: boolean;
  followUp: boolean;
  clientPresent: boolean
  medicationReviewed: boolean
  safetyCheck: boolean
  latitude: number;
  longitude: number;
  patientName: string;
  notes: string;
  serviceType: string;
  submittedAt?: Date;
  id: string;
  orgName: string;
  filePath: string;
  attestationName: string;
}

export interface UpdateVisitDto {
  patientId?: string;
  startedAt?: Date;
  endedAt?: Date;
  submittedAt?: Date;
  serviceType?: string;
  notes?: string;
}
