import logger from "@utils/logger";

import { ENV_CONFIG } from "@config/envConfig";
import cors from "cors";
import express from "express";
import path from "path";
import { sequelize } from "./database/db";
import { initModels } from "./models";
import { BaseRoute } from "./routes/base.routes";

export default class App {
  public app: express.Application;
  public port: number;

  constructor(routes: BaseRoute[]) {
    this.app = express();
    this.port = ENV_CONFIG.PORT;

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
    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '..', 'uploads'))
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
