import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "@utils/logger";

dotenv.config();


// Create Sequelize instance
export const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  } );

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Connected to PostgreSQL database successfully!");
  } catch (error) {
    logger.error("❌ Failed to connect to PostgreSQL:", error);
  }
})();

export default sequelize;
