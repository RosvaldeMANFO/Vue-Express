import mongoose, { Schema } from "mongoose";
import {
  BookState,
  BookStatus,
  LiteralGender,
  CollectionName,
} from "./constants";
import BookCopies from "./book_copies.model";

export interface IBook extends Document {
  isbn: string;
  title: string;
  genre: string;
  author: string;
  publicationDate: Date;
  publishingHouse: string;
  status: string;
  state: string;
  copy: string;
}

export type BookInput = {
  isbn: string;
  title: string;
  genre: string;
  author: string;
  publicationDate: Date;
  publishingHouse: string;
  copy: string;
  status?: string;
  state?: string;
};

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
    title: {
      type: String,
      required: true,
      unique: true,
    },
    genre: {
      type: String,
      required: true,
      default: LiteralGender.Neutral,
      enum: LiteralGender,
    },
    author: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    publishingHouse: {
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
    copy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", async function (next) {
  const stock = await BookCopies.findById(this.copy);
  if (stock == null) {
    throw new Error("There is not any collection for the books of this title");
  }
  next()
});

const Book = mongoose.model(CollectionName.Books, bookSchema);

export default Book;
