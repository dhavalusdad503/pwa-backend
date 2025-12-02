import { joiCommon } from "@helper/joi-schema.helper";
import Joi from "joi";

export const createVisitSchema = Joi.object({
  patientName: joiCommon.joiString.required(),
  startedAt: joiCommon.joiDate.optional(),
  endedAt: joiCommon.joiDate.optional(),
  serviceType: joiCommon.joiString.optional(),
  notes: joiCommon.joiString.optional(),
  address: joiCommon.joiString.optional(),
  submittedAt: joiCommon.joiDate.optional(),
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
  // orgId: string;
  // caregiverId: string;
  // patientId: string;
  // startedAt?: Date;
  // endedAt?: Date;
  submittedAt?: Date;
  // serviceType?: string;
  // notes?: string;
  patientName: string;
  startedAt: Date;
  endedAt: Date;
  serviceType: string;
  notes: string;
  address: string;
  id: string;
  orgName: string; 
}

export interface UpdateVisitDto {
  patientId?: string;
  startedAt?: Date;
  endedAt?: Date;
  submittedAt?: Date;
  serviceType?: string;
  notes?: string;
}
