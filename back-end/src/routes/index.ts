import { Router } from 'express'
import UserRoute from './user.route'
import ApplicationController from '../controllers'
import BookRoute from './book.route'
import RequestRoute from './request.route'
import { BookCollectionRoute } from './book_collection.route'

export default class ApplicationRouter {
    routes!: Router
    userRoute!: UserRoute
    bookRoute!: BookRoute
    requestRoute!: RequestRoute
    bookCpRoute!: BookCollectionRoute

    constructor(private controllers: ApplicationController) {
        this.initializeRoutes()
        this.configureRouter()
    }

    private initializeRoutes() {
        this.userRoute = new UserRoute(this.controllers.userController)
        this.bookRoute = new BookRoute(this.controllers.bookController)
        this.requestRoute = new RequestRoute(this.controllers.requestController)
        this.bookCpRoute = new BookCollectionRoute(this.controllers.bookCpController)
    }

    private configureRouter() {
        this.routes = Router()
        this.routes.use('/user', this.userRoute.router)
        this.routes.use('/book', this.bookRoute.router)
        this.routes.use('/request', this.requestRoute.router)
        this.routes.use('/collection', this.bookCpRoute.router)
    }
}
