import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
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
  declare notes: string | null;
  // declare createdAt: CreationOptional<Date>;
  // declare updatedAt: CreationOptional<Date>;

  public static initModel(sequelize: Sequelize): typeof Visit {
    Visit.init(
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
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        // createdAt: {
        //   type: DataTypes.DATE,
        //   defaultValue: DataTypes.NOW,
        //   allowNull: false,
        //   field: "created_at",
        // },
        // updatedAt: {
        //   type: DataTypes.DATE,
        //   defaultValue: DataTypes.NOW,
        //   allowNull: false,
        //   field: "updated_at",
        // },
      },
      {
        sequelize,
        tableName: "visits",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
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
