import logger from "@utils/logger";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./database/db";
import { initModels } from "./models";
import { BaseRoute } from "./routes/base.routes";

dotenv.config();

export default class App {
  public app: express.Application;
  public port: number;

  constructor(routes: BaseRoute[]) {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.initializeMiddlewares();
    initModels();
    this.initializeRoutes(routes);
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
  }

  private initializeRoutes(routes: BaseRoute[]): void {
    routes.forEach((route) => {
      this.app.use(`/api${route.path}`, route.router);
    });
  }

  public async listen(): Promise<void> {
    try {
      await sequelize.authenticate();
      logger.info("✅ Database connection established successfully.");

      this.app.listen(this.port, () => {
        logger.info(`🚀 Server is running at http://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}
