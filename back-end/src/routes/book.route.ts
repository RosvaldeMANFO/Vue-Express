import { Router } from "express";
import BookController from "../controllers/book.controller";
import { Access } from "../middlewares/authorization";
import { Roles } from "../models/constants";

export default class BookRoute {
  router!: Router;
  constructor(private controller: BookController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post("/create", Access.verify(Roles.Admin), this.controller.createBook);
    this.router.put("/:bookId", Access.verify(Roles.Admin), this.controller.updateBook);
    this.router.delete("/:bookId", Access.verify(Roles.Admin), this.controller.deleteBook);
    this.router.get("/all", this.controller.getAllBooks);
    this.router.post("/find", this.controller.findBooks);
  }
}
