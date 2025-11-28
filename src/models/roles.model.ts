import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

// Role Model Class
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare createdAt: CreationOptional<Date>;

  public static initModel(sequelize: Sequelize): typeof Role {
    Role.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'roles',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['name'],
          },
        ],
      }
    );

    return Role;
  }

  // Associations
  public static associate(models: any): void {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });
  }
}

export default Role;
