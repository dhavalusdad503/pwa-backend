import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Organization extends Model<
  InferAttributes<Organization>,
  InferCreationAttributes<Organization>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static initModel(sequelize: Sequelize): typeof Organization {
    Organization.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "organizations",
        timestamps: true,
        underscored: true,
      }
    );

    return Organization;
  }

  public static associate(models: any): void {
    // No associations yet
    Organization.belongsToMany(models.User, {
      through: models.OrgUser,
      foreignKey: "orgId",
      as: "users",
    });
    Organization.hasMany(models.OrgUser, {
      foreignKey: "orgId",
      as: "orgUsers",
    });
  }
}

export default Organization;
