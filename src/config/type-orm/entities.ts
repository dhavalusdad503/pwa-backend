import { OrgUser } from '@/modules/org-user/entities/org-user.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Patient } from '@/modules/patient/entities/patient.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Visit } from '@/modules/visit/entities/visit.entity';

export const Entities = [
  User,
  Visit,
  Role,
  Patient,
  Organization,
  OrgUser,
] as const;
