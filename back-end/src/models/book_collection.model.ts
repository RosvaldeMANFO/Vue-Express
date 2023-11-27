import mongoose, { Schema } from "mongoose";
import { CollectionName, LiteralGender } from "./constants";

export interface IBookCollection extends Document {
  title: string;
  genre: LiteralGender;
  author: string;
  publicationDate: Date;
  publishingHouse: string;
  bookCover: string;
  quantity: number;
  defaultCover: String;
}

const bookCopiesSchema = new Schema<IBookCollection>(
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
  }
);

export const BookCollection = mongoose.model(
  CollectionName.BookCollection,
  bookCopiesSchema
);

export default BookCollection;
