import mongoose, { Schema } from "mongoose";
import { CollectionName } from "./constants";

export interface IBookCopies extends Document {
    title: string;
    quantity: number;
}

const bookCopiesSchema = new Schema<IBookCopies>({
    title: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        default: 0
    }
})

export const BookCopies = mongoose.model(CollectionName.BookCopies, bookCopiesSchema);

export default BookCopies;