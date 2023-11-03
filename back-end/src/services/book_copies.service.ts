import BookCopies, { IBookCopies } from "../models/book_copies.model"
import { HttpCode, RequestSuccess } from "../utils/request_result"

export interface IBookCopiesService {
    createStock(title: string, quantity: number): Promise<string>
    updateStock(stockId: string, quantity: number): Promise<void>
    deleteStock(stockId: string): Promise<void>
    getAll(): Promise<RequestSuccess<IBookCopies[]>>
    getById(stockId: string): Promise<RequestSuccess<IBookCopies>>
}

export class BookCopiesService implements IBookCopiesService {
    async createStock(title: string, quantity: number): Promise<string> {
       const stock =  await BookCopies.create({
            title,
            quantity
        })
        return stock._id.toString()
    }
    async updateStock(stockId: string, quantity: number): Promise<void> {
        await BookCopies.findByIdAndUpdate(stockId, {quantity})
    }
    async deleteStock(stockId: string): Promise<void> {
        await BookCopies.findByIdAndDelete(stockId)
    }
    async getAll(): Promise<RequestSuccess<IBookCopies[]>> {
        const result = await BookCopies.find()
        return new RequestSuccess(HttpCode.OK, result, "Retrieving all book copies")
    }

    async  getById(stockId: string): Promise<RequestSuccess<IBookCopies>> {
        const result = await BookCopies.findById(stockId)
        if(result == null){
            throw new Error("Collection not found")
        }
        return new RequestSuccess(HttpCode.OK, result, `Retrieving collection ${result.title}`) 
    }

}