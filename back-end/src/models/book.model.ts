import mongoose, { Schema } from "mongoose";
import { BookStates, BookStatus, LiteralGenders } from "./constants";

export interface IBook extends Document {
  isbn: string;
  title: string;
  genre: string;
  author: string;
  publicationDate: Date;
  editionHouse: string;
  status: string;
  state: string;
  nbmCopies: number;
}

const bookSchema = new Schema<IBook>(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      types: String,
      required: true,
      unique: true,
    },
    genre: {
      types: String,
      required: true,
      default: LiteralGenders.Neutral,
      enum: LiteralGenders
    },
    author: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    editionHouse: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: BookStatus.Available,
      enum: BookStatus
    },
    state: {
      type: String,
      default: BookStates.Correct,
      enum: BookStates
    },
    nbmCopies: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Books", bookSchema);

export default Book;
