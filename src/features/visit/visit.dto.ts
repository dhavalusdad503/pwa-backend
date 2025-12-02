import { joiCommon } from "@helper/joi-schema.helper";
import Joi from "joi";

export const createVisitSchema = Joi.object({
  // orgId: joiCommon.joiString.uuid().required(),
  // caregiverId: joiCommon.joiString.uuid().required(),
  patientName: joiCommon.joiString.optional(),
  start_time: joiCommon.joiDate.optional(),
  end_time: joiCommon.joiDate.optional(),
  serviceType: joiCommon.joiString.optional(),
  notes: joiCommon.joiString.optional(),
  address: joiCommon.joiString.optional(),
});

export const updateVisitSchema = Joi.object({
  orgId: joiCommon.joiString.uuid().optional(),
  caregiverId: joiCommon.joiString.uuid().optional(),
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
  // submittedAt?: Date;
  // serviceType?: string;
  // notes?: string;
  PatientId: string;
  patientName: string;
  start_time: Date;
  end_time: Date;
  serviceType: { value: string; label: string };
  notes: string;
  address: string;
  id: string;
  OrgId: string;
  OrgName: string;
}

export interface UpdateVisitDto {
  orgId?: string;
  caregiverId?: string;
  patientId?: string;
  startedAt?: Date;
  endedAt?: Date;
  submittedAt?: Date;
  serviceType?: string;
  notes?: string;
}
