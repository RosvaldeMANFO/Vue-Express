import { Router } from 'express'
import UserController from '../controllers/user.controller'
import { Roles } from '../models/constants'
import { Access } from '../middlewares/authorization'

export default class UserRoute {
    router!: Router
    constructor(private controller: UserController) {
        this.configureRoutes()
    }

    private configureRoutes(): void {
        this.router = Router()
        this.router.post('/verify_token', Access.validation)
        this.router.post('/register', this.controller.register)
        this.router.post('/login', this.controller.login)
        this.router.get('/all', Access.verify(Roles.Admin), this.controller.getAllUsers)
        this.router.get('/history/:userId', this.controller.getUserHistory)
        this.router.post('/cancel', Access.verify(Roles.Reader), this.controller.cancelRequest)
        this.router.post('/find', Access.verify(Roles.Admin), this.controller.findReader)
    }
}
