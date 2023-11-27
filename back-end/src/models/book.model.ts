import mongoose, { Schema } from "mongoose";
import {
  BookState,
  BookStatus,
  CollectionName,
} from "./constants";
import { BookCollection } from "./book_collection.model";

export interface IBook extends Document {
  isbn: string;
  collectionId: string;
  status: string;
  state: string;
}

export type FilterOption = {
  genre?: string;
  title?: string;
  author?: string;
  publicationDate?: string;
  publishingHouse?: string;
};

const bookSchema = new Schema<IBook>(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    collectionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: BookStatus.Available,
      enum: BookStatus,
    },
    state: {
      type: String,
      default: BookState.Correct,
      enum: BookState,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", async function (next) {
  const collection = await BookCollection.findById(this.collectionId);
  if (collection == null) {
    throw new Error("There is not any collection for the books of this title");
  }
  next();
});

const Book = mongoose.model(CollectionName.Books, bookSchema);

export default Book;
