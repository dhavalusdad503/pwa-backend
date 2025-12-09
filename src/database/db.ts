import { ENV_CONFIG } from "@config/envConfig";
import logger from "@utils/logger";
import { Sequelize } from "sequelize";

// Create Sequelize instance
export const sequelize = ENV_CONFIG.DATABASE_URL
  ? new Sequelize(ENV_CONFIG.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(
      ENV_CONFIG.DATABASE_CONFIG.DB_NAME,
      ENV_CONFIG.DATABASE_CONFIG.USER,
      ENV_CONFIG.DATABASE_CONFIG.PASSWORD,
      {
        host: ENV_CONFIG.DATABASE_CONFIG.HOST,
        dialect: "postgres",
        logging: ENV_CONFIG.NODE_ENV === "development" ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Connected to PostgreSQL database successfully!");
  } catch (error) {
    logger.error("❌ Failed to connect to PostgreSQL:", error);
  }
})();

export default sequelize;
