import { Router } from "express";
import BorrowController from "../controllers/borrow.controller";

export default class BorrowRoute {
  router!: Router;
  constructor(private controller: BorrowController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post("/create", this.controller.createBorrow);
    this.router.put("/:borrowId", this.controller.updateBorrow);
    this.router.delete("/:borrowId", this.controller.deleteBorrow);
    this.router.get("/all", this.controller.getAllBorrows);
    this.router.post("/find", this.controller.getBorrowByEmail);
  }
}
