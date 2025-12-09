import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

// Role Model Class
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;

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
      },
      {
        sequelize,
        tableName: "roles",
        timestamps: true,
        underscored: true,
        updatedAt: false,
        indexes: [
          {
            unique: true,
            fields: ["name"],
          },
        ],
      }
    );

    return Role;
  }

  // Associations
  public static associate(models: any): void {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });
  }
}

export default Role;
