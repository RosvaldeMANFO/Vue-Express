import { Router } from "express";
import BookController from "../controllers/book.controller";

export default class BookRoute {
  router!: Router;
  constructor(private controller: BookController) {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router = Router();
    this.router.post("/create", this.controller.createBook);
    this.router.put("/:bookId", this.controller.updateBook);
    this.router.delete("/:bookId", this.controller.deleteBook);
    this.router.get("/all", this.controller.getAllBooks);
    this.router.post("/find", this.controller.findBooks);
  }
}
