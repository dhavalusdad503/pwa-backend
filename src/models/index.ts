import { sequelize } from '../database/db';
import Role from './roles.model';
import User from './user.model';
import Organization from './organization.model';
import OrgUser from './org-user.model';
import Patient from './patient.model';
import Visit from './visit.model';

export const initModels = () => {
  // Initialize models
  Role.initModel(sequelize);
  User.initModel(sequelize);
  Organization.initModel(sequelize);
  OrgUser.initModel(sequelize);
  Patient.initModel(sequelize);
  Visit.initModel(sequelize);

  // Initialize associations
  const models = {
    Role,
    User,
    Organization,
    OrgUser,
    Patient,
    Visit,
  };

  Role.associate(models);
  User.associate(models);
  Organization.associate(models);
  OrgUser.associate(models);
  Patient.associate(models);
  Visit.associate(models);
};

export { Role, User, Organization, OrgUser, Patient, Visit };
