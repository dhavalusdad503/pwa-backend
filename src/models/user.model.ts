import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// // User Model Class
// class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // Properties
  declare id: CreationOptional<string>;
  declare firstName: string | null;
  declare lastName: string | null;
  declare email: string;
  declare phone: CreationOptional<string | null>;
  declare roleId: string;
  declare password: CreationOptional<string>;
  declare active: boolean;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public generateToken(): string {
    const payload = { id: this.id, email: this.email };
    return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });
  }

  public static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'first_name',
        },
        lastName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'last_name',
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'password',
        },
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'role_id',
          references: {
            model: 'roles',
            key: 'id',
          },
          onDelete: 'RESTRICT',
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
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
        tableName: 'users',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['email'],
          },
        ],
      }
    );

    return User;

  }

  // Associations
  public static associate(models: any): void {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
  }

}

export default User;

