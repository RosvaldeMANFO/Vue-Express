import { Router } from 'express'
import RequestController from '../controllers/request.controller'
import { Access } from '../middlewares/authorization'
import { Roles } from '../models/constants'

export default class RequestRoute {
    router!: Router
    constructor(private controller: RequestController) {
        this.configureRoutes()
    }

    private configureRoutes(): void {
        this.router = Router()
        this.router.post('/create', Access.verify(Roles.Reader), this.controller.createRequest)
        this.router.put('/:requestId', Access.verify(Roles.Admin), this.controller.updateRequest)
        this.router.delete('/:requestId', Access.verify(Roles.Admin), this.controller.deleteRequest)
        this.router.get('/all', Access.verify(Roles.Admin), this.controller.getAllRequest)
        this.router.post('/find', this.controller.getRequestByIdOrEmail)
    }
}
