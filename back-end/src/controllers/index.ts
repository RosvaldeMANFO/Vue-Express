import ApplicationService from "../services"
import BookController from "./book.controller"
import BorrowController from "./borrow.controller"
import UserController from "./user.controller"

export default class ApplicationController{
    userController!: UserController
    bookController!: BookController
    borrowController!: BorrowController

    constructor(private services: ApplicationService){
        this.initializeControllers()
    }

    private initializeControllers(): void {
        this.userController = new UserController(this.services.userService)
        this.bookController = new BookController(this.services.bookService)
        this.borrowController = new BorrowController(this.services.borrowService)
    }
}