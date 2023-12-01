import ApplicationService from "../services"
import BookController from "./book.controller"
import { BookCollectionController } from "./book_collection.controller"
import RequestController from "./request.controller"
import UserController from "./user.controller"

export default class ApplicationController{
  userController!: UserController
  bookController!: BookController
  requestController!: RequestController
  bookCpController!: BookCollectionController

  constructor(private services: ApplicationService){
    this.initializeControllers()
  }

  private initializeControllers(): void {
    this.userController = new UserController(this.services.userService)
    this.bookController = new BookController(this.services.bookService, this.services.bookCpService)
    this.requestController = new RequestController(this.services.requestService)
    this.bookCpController = new BookCollectionController(this.services.bookCpService)
  }
}