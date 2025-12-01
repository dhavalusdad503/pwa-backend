import { Router } from "express";

export abstract class BaseRoute {
  public router: Router;
  public path: string;

  constructor(path: string) {
    this.router = Router();
    this.path = path;
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;
}
