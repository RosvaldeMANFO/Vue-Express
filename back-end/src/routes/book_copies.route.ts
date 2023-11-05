import { Router } from "express";
import { BookCopiesController } from "../controllers/book_copies.controller";
import { Access } from "../middlewares/authorization";
import { Roles } from "../models/constants";

export class BookCopiesRoute{
  router!: Router

  constructor(private controller: BookCopiesController){
    this.router = Router()
    this.router.get("/all",Access.verify(Roles.Admin), controller.getAllBookCopies)
    this.router.delete("/:stockId", Access.verify(Roles.Admin), controller.deleteStock)
  }
}