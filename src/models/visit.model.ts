import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

class Visit extends Model<
  InferAttributes<Visit>,
  InferCreationAttributes<Visit>
> {
  declare id: CreationOptional<string>;
  declare orgId: string;
  declare caregiverId: string;
  declare patientId: string;
  declare startedAt: Date | null;
  declare endedAt: Date | null;
  declare submittedAt: Date | null;
  declare serviceType: string | null;
  declare address: string | null;
  declare notes: string | null;
  declare tempId: number;

  public static initModel(sequelize: Sequelize): typeof Visit {
    Visit.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        tempId: {
          type: DataTypes.VIRTUAL,
          allowNull: true,
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
        caregiverId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "caregiver_id",
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        patientId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "patient_id",
          references: {
            model: "patients",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        startedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "started_at",
        },
        endedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "ended_at",
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "submitted_at",
        },
        serviceType: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "service_type",
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "visits",
        timestamps: true,
        paranoid: true,
        underscored: true,
      }
    );

    return Visit;
  }

  public static associate(models: any): void {
    Visit.belongsTo(models.Organization, {
      foreignKey: "orgId",
      as: "organization",
    });
    Visit.belongsTo(models.User, {
      foreignKey: "caregiverId",
      as: "caregiver",
    });
    Visit.belongsTo(models.Patient, { foreignKey: "patientId", as: "patient" });
  }
}

export default Visit;
