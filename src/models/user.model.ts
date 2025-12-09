import { AuthProvider, UserStatus } from "@enums";
import Organization from "@models/organization.model";
import Role from "@models/roles.model";
import bcrypt from "bcrypt";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

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
  declare authProvider: string;
  declare status: string;
  declare role?: Role;
  declare organizations?: Organization[];
  declare resetPassToken?: string | null;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // public generateToken(): string {
  //   const payload = { id: this.id, email: this.email };
  //   return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
  //     expiresIn: "24h",
  //   });
  // }

  public static USER_FIRST_NAME_MAX_LENGTH = 100;
  public static USER_LAST_NAME_MAX_LENGTH = 100;
  public static USER_EMAIL_MAX_LENGTH = 150;
  public static USER_PHONE_MAX_LENGTH = 20;
  public static USER_PASSWORD_MAX_LENGTH = 255;

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
          type: DataTypes.STRING(this.USER_FIRST_NAME_MAX_LENGTH),
          allowNull: false,
          field: "first_name",
        },
        lastName: {
          type: DataTypes.STRING(this.USER_LAST_NAME_MAX_LENGTH),
          allowNull: false,
          field: "last_name",
        },
        email: {
          type: DataTypes.STRING(this.USER_EMAIL_MAX_LENGTH),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING(this.USER_PHONE_MAX_LENGTH),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(this.USER_PASSWORD_MAX_LENGTH),
          allowNull: false,
          field: "password",
        },
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "role_id",
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "RESTRICT",
        },
        status: {
          type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE),
          defaultValue: UserStatus.ACTIVE,
          allowNull: false,
        },
        authProvider: {
          type: DataTypes.ENUM(
            AuthProvider.EMAIL,
            AuthProvider.GOOGLE,
            AuthProvider.FACEBOOK,
            AuthProvider.GITHUB,
            AuthProvider.TWITTER
          ),
          defaultValue: AuthProvider.EMAIL,
          allowNull: false,
        },
        resetPassToken: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "reset_pass_token",
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
        tableName: "users",
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ["email"],
          },
        ],
      }
    );

    return User;
  }

  // Associations
  public static associate(models: any): void {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
    User.belongsToMany(models.Organization, {
      through: models.OrgUser,
      foreignKey: "userId",
      as: "organizations",
    });

    User.hasMany(models.OrgUser, {
      foreignKey: "userId",
      as: "userOrgs",
    });
  }
}

export default User;
