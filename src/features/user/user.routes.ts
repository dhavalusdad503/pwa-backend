import { BaseRoute } from '../../routes/base.routes';
import { asyncHandler } from '../../helper/async-handler.helper';
import userController from './user.controller';

export default class UserRoute extends BaseRoute {
  constructor() {
    super('/user');
  }

  protected initializeRoutes(): void {
    this.router.post("/register", asyncHandler(userController.createUser));
    this.router.post("/login", asyncHandler(userController.loginUser));
    this.router.put("/:userId", asyncHandler(userController.updateUser));
    this.router.get("/:userId", asyncHandler(userController.getUserById));
    this.router.get("/test", asyncHandler(userController.test));
    this.router.delete("/:userId", asyncHandler(userController.deleteUser));
  }
}