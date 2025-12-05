import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Patient extends Model<
  InferAttributes<Patient>,
  InferCreationAttributes<Patient>
> {
  declare id: CreationOptional<string>;
  declare orgId: string;
  declare name: string | null;
  declare primaryAddress: string | null;

  public static initModel(sequelize: Sequelize): typeof Patient {
    Patient.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
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
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        primaryAddress: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "primary_address",
        },
      },
      {
        sequelize,
        tableName: "patients",
        timestamps: true,
        underscored: true,
      }
    );

    return Patient;
  }

  public static associate(models: any): void {
    Patient.belongsTo(models.Organization, {
      foreignKey: "orgId",
      as: "organization",
    });
  }
}

export default Patient;
