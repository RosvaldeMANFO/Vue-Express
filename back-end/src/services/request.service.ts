import { HttpCode, RequestFailure, RequestSuccess } from '../utils/request_result'
import Book from '../models/book.model'
import { BookStatus, RequestStatus } from '../models/constants'
import Request, { RequestInput, IRequest } from '../models/request.model'
import BookCollection from '../models/book_collection.model'
import { Types, Document } from 'mongoose'
import Utils from '../utils/utils'

export interface IRequestService {
    createRequest(borrow: RequestInput): Promise<void>
    updateRequest(requestId: string, borrow: IRequest): Promise<void>
    deleteRequest(requestId: string): Promise<void>
    getAllRequest(): Promise<RequestSuccess<IRequest[]>>
    getRequestByIdOrEmail(email: string): Promise<RequestSuccess<IRequest[]>>
}

export class RequestService implements IRequestService {
    async createRequest(borrow: RequestInput): Promise<void> {
        await Request.create(borrow)
    }

    async updateRequest(requestId: string, borrow: IRequest): Promise<void> {
        await Request.findByIdAndUpdate(requestId, borrow)
        await this.updateStock(requestId, borrow.bookId, borrow.requestStatus)
    }

    async deleteRequest(requestId: string): Promise<void> {
        await Request.findByIdAndDelete(requestId)
    }

    async getAllRequest(): Promise<RequestSuccess<IRequest[]>> {
        let result = await Request.find()
        const acceptedStatus = Object.values(RequestStatus)
            .filter((value) => value != RequestStatus.Canceled)
            .map((status) => status.valueOf())
        result = result.filter((request) => acceptedStatus.includes(request.requestStatus))
        return new RequestSuccess(HttpCode.OK, result, 'Getting all request')
    }

    async getRequestByIdOrEmail(query: string): Promise<RequestSuccess<IRequest[]>> {
        const rules: {}[] = [{ userEmail: RegExp(`${query}`, 'i') }]
        if (Utils.isValidInput(query)) {
            rules.push({ _id: new Types.ObjectId(query) })
        }
        const result = await Request.find({ $or: rules })
        return new RequestSuccess(HttpCode.OK, result, `Getting request of ${query}`)
    }

    private async updateStock(requestId: string, bookId: string, borrowStatus: string): Promise<void> {
        const book = await Book.findById(bookId)
        const stock = await BookCollection.findById(book?.collectionId)
        const borrow = await Request.findById(requestId)
        if (borrowStatus == RequestStatus.Approved && borrow?.requestStatus != RequestStatus.Approved) {
            await BookCollection.findByIdAndUpdate(stock!.id, {
                quantity: stock!.quantity - 1,
            })
            await Book.findByIdAndUpdate(bookId, {
                status: stock!.quantity - 1 == 0 ? BookStatus.Unavailable : BookStatus.Available,
            })
        }
        if (borrowStatus == RequestStatus.Returned && borrow?.requestStatus != RequestStatus.Returned) {
            await BookCollection.findByIdAndUpdate(stock!.id, {
                quantity: stock!.quantity + 1,
            })
            await Book.findByIdAndUpdate(bookId, {
                status: BookStatus.Available,
            })
        }
    }
}
