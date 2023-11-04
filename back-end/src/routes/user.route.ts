import { Router } from "express";
import UserController from "../controllers/user.controller";

export default class UserRoute {
  router!: Router;
  constructor(private controller: UserController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post("/register", this.controller.register);
    this.router.post("/login", this.controller.login);
    this.router.get("/all", this.controller.getAllUsers);
    this.router.get("/history/:userId", this.controller.getUserHistory);
  }
}
