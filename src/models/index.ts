import { sequelize } from '../database/db';
import Role from './roles.model';
import User from './user.model';
import Organization from './organization.model';
import OrgUser from './org-user.model';
import Patient from './patient.model';

export const initModels = () => {
  // Initialize models
  Role.initModel(sequelize);
  User.initModel(sequelize);
  Organization.initModel(sequelize);
  OrgUser.initModel(sequelize);
  Patient.initModel(sequelize);

  // Initialize associations
  const models = {
    Role,
    User,
    Organization,
    OrgUser,
    Patient,
  };

  Role.associate(models);
  User.associate(models);
  Organization.associate(models);
  OrgUser.associate(models);
  Patient.associate(models);
};

export { Role, User, Organization, OrgUser, Patient };
