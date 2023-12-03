import { NextFunction, Request, Response } from 'express'
import { IBookService } from '../services/book.service'
import { HttpCode } from '../utils/request_result'
import { IBookCollectionService } from '../services/book_collection.service'
import Book, { BookCollection, IBookCollection } from '../models/book_collection.model'
import { IBook } from '../models/book.model'

export default class BookController {
    constructor(
        private bookService: IBookService,
        private collectionService: IBookCollectionService,
    ) {}

    getBookById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const book = await this.bookService.getBookById(req.params.bookId)
            console.log(JSON.stringify(book))
            res.status(HttpCode.OK).json(book.data)
        } catch (err) {
            next(err)
        }
    }

    createBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const book = await this.validateCollection(req)
            await this.bookService.registerBook(book)
            res.status(HttpCode.OK).json({ message: `Book ${book.isbn} registered` })
        } catch (err) {
            next(err)
        }
    }

    updateBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const book = await this.validateCollection(req)
            await this.bookService.updateBook(req.params.bookId, book)
            res.status(HttpCode.OK).json({ message: `Book ${book.isbn} updated` })
        } catch (err) {
            next(err)
        }
    }

    getAllBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const books = await this.bookService.getAllBook()
            res.status(HttpCode.OK).json(books.data)
        } catch (err) {
            next(err)
        }
    }

    deleteBook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.bookService.deleteBook(req.params.bookId)
            res.status(HttpCode.OK).json({ message: `one book deleted` })
        } catch (err) {
            next(err)
        }
    }

    findBookByISBN = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.bookService.findBookByISBN(req.body.isbn)
            res.status(result.httpCode).json(result.data)
        } catch (err) {
            next(err)
        }
    }

    private validateCollection = async (req: Request): Promise<IBook> => {
        const initCollection = req.query.initCollection
        if (initCollection === 'true') {
            let data: IBook = { ...req.body.book }
            data.collectionId = await this.collectionService.createCollection({
                ...req.body.collection,
            })
            return data
        } else {
            const collection = await BookCollection.findOne({
                title: req.body.collection.title,
            })
            if (!collection) {
                throw Error(
                    'There is no collection with this title. You need to create one collection with this title before continue',
                )
            }
            let data: IBook = { ...req.body.book }
            data.collectionId = collection.id
            return data
        }
    }
}
