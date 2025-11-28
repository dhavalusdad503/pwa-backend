import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

class Patient extends Model<InferAttributes<Patient>, InferCreationAttributes<Patient>> {
  declare id: CreationOptional<string>;
  declare orgId: string;
  declare name: string | null;
  declare primaryAddress: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
          field: 'org_id',
          references: {
            model: 'organizations',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        primaryAddress: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'primary_address',
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'patients',
        timestamps: true,
        underscored: true,
      }
    );

    return Patient;
  }

  public static associate(models: any): void {
    Patient.belongsTo(models.Organization, { foreignKey: 'orgId', as: 'organization' });
  }
}

export default Patient;
