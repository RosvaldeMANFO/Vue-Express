import { Router } from "express";
import BorrowController from "../controllers/borrowing.controller";
import { Access } from "../middlewares/authorization";
import { Roles } from "../models/constants";

export default class BorrowRoute {
  router!: Router;
  constructor(private controller: BorrowController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post(
      "/create",
      Access.verify(Roles.Reader),
      this.controller.createBorrowing
    );
    this.router.put(
      "/:borrowId",
      Access.verify(Roles.Admin),
      this.controller.updateBorrowing
    );
    this.router.delete(
      "/:borrowId",
      Access.verify(Roles.Admin),
      this.controller.deleteBorrowing
    );
    this.router.get(
      "/all",
      Access.verify(Roles.Admin),
      this.controller.getAllBorrowings
    );
    this.router.post("/find", this.controller.getBorrowingByEmail);
  }
}
