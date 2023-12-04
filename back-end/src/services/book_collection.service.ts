import { BookCollection, IBookCollection } from '../models/book_collection.model'
import { HttpCode, RequestSuccess } from '../utils/request_result'
import Utils from '../utils/utils'

export interface IBookCollectionService {
    createCollection(collection: IBookCollection): Promise<string>
    updateCollection(collectionId: string, collection: IBookCollection): Promise<void>
    deleteCollection(collectionId: string): Promise<void>
    getAllCollection(): Promise<RequestSuccess<IBookCollection[]>>
    getCollectionById(collectionId: string): Promise<RequestSuccess<IBookCollection>>
    findCollection(filterOptions: Map<string, unknown>): Promise<RequestSuccess<IBookCollection[]>>
}

export class BookCollectionService implements IBookCollectionService {
    async createCollection(collection: IBookCollection): Promise<string> {
        const result = await BookCollection.create(collection)
        return result._id.toString()
    }

    async updateCollection(collectionId: string, collection: IBookCollection): Promise<void> {
        await BookCollection.findByIdAndUpdate(collectionId, collection)
    }

    async getAllCollection(): Promise<RequestSuccess<IBookCollection[]>> {
        const result = await BookCollection.find()
        return new RequestSuccess(HttpCode.OK, result, 'Retrieving all collections')
    }

    async getCollectionById(collectionId: string): Promise<RequestSuccess<IBookCollection>> {
        const result = await BookCollection.findById(collectionId)
        if (result == null) {
            throw new Error('Collection not found')
        }
        return new RequestSuccess(HttpCode.OK, result, `Retrieving collection ${result.title}`)
    }

    async deleteCollection(collectionId: string): Promise<void> {
        await BookCollection.findByIdAndDelete(collectionId)
    }

    async findCollection(filterOptions: Map<string, unknown>): Promise<RequestSuccess<IBookCollection[]>> {
        const options = Utils.cleanFilterOptions(filterOptions)
        const result = await BookCollection.find({ $or: options })
        return new RequestSuccess(HttpCode.OK, result, '')
    }
}
