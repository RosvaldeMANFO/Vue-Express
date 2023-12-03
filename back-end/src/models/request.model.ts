import mongoose, { Schema } from 'mongoose'
import { BookState, BookStatus, RequestStatus, CollectionName } from './constants'
import User from './user.model'
import Book from './book.model'

export interface IRequest extends Document {
    userId: string
    bookId: string
    collectionId: string
    userEmail: string
    bookIsbn: string
    bookTitle: string
    receivingDate?: Date
    returningDate?: Date
    receivingState: string
    returningState: string
    requestStatus: string
}

export type RequestInput = {
    userId: string
    bookId: string
    collectionId: string
    userEmail: string
    bookIsbn: string
    bookTitle: string
}

const borrowSchema = new Schema<IRequest>(
    {
        userId: {
            type: String,
            ref: CollectionName.Users,
            required: true,
        },
        bookId: {
            type: String,
            ref: CollectionName.Books,
            required: true,
        },
        collectionId: {
            type: String,
            ref: CollectionName.BookCollection,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        bookIsbn: {
            type: String,
            required: true,
        },
        bookTitle: {
            type: String,
            required: true,
        },
        receivingDate: {
            type: Date,
            required: false,
            default: null,
        },
        returningDate: {
            type: Date,
            required: false,
            default: null,
        },
        receivingState: {
            type: String,
            default: BookState.Correct,
            enum: BookState,
        },
        returningState: {
            type: String,
            default: BookState.Correct,
            enum: BookState,
        },
        requestStatus: {
            type: String,
            default: RequestStatus.OnHold,
            enum: RequestStatus,
        },
    },
    {
        timestamps: true,
    },
)

borrowSchema.pre('save', async function (next) {
    const user = await User.findById(this.userId)
    const book = await Book.findById(this.bookId)
    if (user == null || book == null) {
        throw new Error("User or Book doesn't exist")
    }
    if (book.status == BookStatus.Unavailable) {
        throw new Error('Book is not available')
    }

    const exists = await Request.find({
        userId: this.userId,
        bookTitle: this.bookTitle,
    })
    const status = new Set([RequestStatus.Canceled.valueOf(), RequestStatus.Returned.valueOf()])
    if (!exists.every((element) => status.has(element.requestStatus))) {
        throw new Error('You already have a request for this book')
    }

    next()
})

const Request = mongoose.model(CollectionName.Borrows, borrowSchema)

export default Request
