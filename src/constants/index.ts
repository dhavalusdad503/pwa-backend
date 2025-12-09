import { Roles } from "@enums";

export const UserRoleSlugs: Record<Roles, string> = {
  [Roles.SUPERVISOR]: "SUPERVISOR",
  [Roles.ADMIN]: "ADMIN",
  [Roles.CAREGIVER]: "CAREGIVER",
};

export const TEMPLATE_NAME = {
  FORGOT_PASSWORD: "forgotPassword",
};
