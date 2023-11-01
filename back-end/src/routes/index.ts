import { Router } from "express";
import UserRoute from "./user.route";
import ApplicationController from "../controllers";
import { requestHandler } from "../middlewares/request_handler";

export default class ApplicationRouter {
  routes!: Router;
  constructor(private controllers: ApplicationController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routes = Router();
    this.routes.use(
      "/user",
      new UserRoute(this.controllers.userController).router
    );

    this.routes.use(requestHandler);
  }
}
