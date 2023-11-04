import { Router } from "express";
import BorrowController from "../controllers/borrowing.controller";

export default class BorrowRoute {
  router!: Router;
  constructor(private controller: BorrowController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post("/create", this.controller.createBorrowing);
    this.router.put("/:borrowId", this.controller.updateBorrowing);
    this.router.delete("/:borrowId", this.controller.deleteBorrowing);
    this.router.get("/all", this.controller.getAllBorrowings);
    this.router.post("/find", this.controller.getBorrowingByEmail);
  }
}
