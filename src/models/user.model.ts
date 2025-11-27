import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
  
    public async comparePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }
  
    public generateToken(): string {
      const payload = { id: this.id, email: this.email };
      return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn: "24h",
      });
    }
  }
  

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    // paranoid: true,
  }
);

export default User;