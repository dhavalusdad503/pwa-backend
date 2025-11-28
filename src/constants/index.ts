import { Roles } from '@enums';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
};

export const UserRoleSlugs: Record<Roles, string> = {
  [Roles.SUPERVISOR]: 'SPV',
  [Roles.ADMIN]: 'ADM',
  [Roles.CAREGIVER]: 'CARE',
};