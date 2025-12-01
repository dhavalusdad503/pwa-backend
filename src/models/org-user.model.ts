import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class OrgUser extends Model<
  InferAttributes<OrgUser>,
  InferCreationAttributes<OrgUser>
> {
  declare userId: string;
  declare orgId: string;

  public static initModel(sequelize: Sequelize): typeof OrgUser {
    OrgUser.init(
      {
        userId: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          field: "user_id",
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        orgId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "org_id",
          references: {
            model: "organizations",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "org_users",
        timestamps: false,
        underscored: true,
      }
    );

    return OrgUser;
  }

  public static associate(models: any): void {
    OrgUser.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    OrgUser.belongsTo(models.Organization, {
      foreignKey: "orgId",
      as: "organization",
    });
  }
}

export default OrgUser;
