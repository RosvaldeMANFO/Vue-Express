import { Router } from "express";
import { BookCopiesController } from "../controllers/book_copies.controller";

export class BookCopiesRoute{
    router!: Router

    constructor(private controller: BookCopiesController){
        this.router = Router()
        this.router.get("/all", controller.getAllBookCopies)
        this.router.delete("/:stockId", controller.deleteStock)
    }
}