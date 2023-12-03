import mongoose, { Schema, Document } from 'mongoose'
import { CollectionName, LiteralGender } from './constants'

export interface IBookCollection extends Document {
    title: string
    genre: LiteralGender
    author: string
    publicationDate: Date
    publishingHouse: string
    bookCover: string
    quantity: number
    defaultCover: String
}

const bookCollectionSchema = new Schema<IBookCollection>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        author: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
            default: LiteralGender.Neutral,
            enum: LiteralGender,
        },
        bookCover: {
            type: String,
            required: false,
        },
        publicationDate: {
            type: Date,
            required: true,
        },
        publishingHouse: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
)

bookCollectionSchema.pre(/\w*delete\w*/i, async function (next) {
    const query = (this as mongoose.Query<any, any, {}, any, 'find'>).getQuery()
    const collection = await BookCollection.findById(query['_id'])
    if (collection?.quantity != 0) {
        throw new Error('This collection still contains books')
    }
    next()
})

bookCollectionSchema.pre('save', async function (next) {
    const date = this.publicationDate.setHours(0, 0, 0, 0)
    this.publicationDate = new Date(date)
    next()
})

export const BookCollection = mongoose.model(CollectionName.BookCollection, bookCollectionSchema)

export default BookCollection
