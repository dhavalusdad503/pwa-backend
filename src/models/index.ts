import { sequelize } from '../database/db';
import Role from './roles.model';
import User from './user.model';

export const initModels = () => {
  // Initialize models
  Role.initModel(sequelize);
  User.initModel(sequelize);

  // Initialize associations
  const models = {
    Role,
    User,
  };

  Role.associate(models);
  User.associate(models);
};

export { Role, User };
