import { Router } from "express";
import UserRoute from "./user.route";
import ApplicationController from "../controllers";
import BookRoute from "./book.route";
import BorrowRoute from "./borrow.route";
import { BookCopiesRoute } from "./book_copies.route";

export default class ApplicationRouter {
  routes!: Router;
  userRoute!: UserRoute;
  bookRoute!: BookRoute;
  borrowRoute!: BorrowRoute;
  bookCpRoute!: BookCopiesRoute;

  constructor(private controllers: ApplicationController) {
    this.initializeRoutes();
    this.configureRouter();
  }

  private initializeRoutes() {
    this.userRoute = new UserRoute(this.controllers.userController);
    this.bookRoute = new BookRoute(this.controllers.bookController);
    this.borrowRoute = new BorrowRoute(this.controllers.borrowController);
    this.bookCpRoute = new BookCopiesRoute(this.controllers.bookCpController);
  }

  private configureRouter() {
    this.routes = Router();
    this.routes.use("/user", this.userRoute.router);
    this.routes.use("/book", this.bookRoute.router);
    this.routes.use("/borrow", this.borrowRoute.router);
    this.routes.use("/bookCp", this.bookCpRoute.router);
  }
}
