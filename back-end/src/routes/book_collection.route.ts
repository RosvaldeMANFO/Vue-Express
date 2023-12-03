import { Router } from 'express'
import { BookCollectionController } from '../controllers/book_collection.controller'
import { Access } from '../middlewares/authorization'
import { Roles } from '../models/constants'

export class BookCollectionRoute {
    router!: Router

    constructor(private controller: BookCollectionController) {
        this.router = Router()
        this.router.get('/all', Access.verify(Roles.Admin), controller.getAllCollection)
        this.router.post('/create', Access.verify(Roles.Admin), controller.createCollection)
        this.router.put('/:collectionId', Access.verify(Roles.Admin), controller.updateCollection)
        this.router.delete('/:collectionId', Access.verify(Roles.Admin), controller.deleteCollection)
        this.router.post('/find', Access.verify(Roles.Admin), controller.findCollection)
    }
}
