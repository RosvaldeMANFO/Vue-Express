import mongoose, { Schema } from "mongoose";
import {
  BookState,
  BookStatus,
  BorrowStatus,
  CollectionName,
} from "./constants";
import User from "./user.model";
import Book from "./book.model";

export interface IBorrow extends Document {
  userId: string;
  bookId: string;
  userEmail: string;
  bookIsbn: string;
  bookTitle: string;
  receivedDate: Date;
  returnDate: Date;
  returnState: string;
  receivedState: string;
  borrowStatus: string;
}

export type BorrowInput = {
  userId: string;
  bookId: string;
  userEmail: string;
  bookIsbn: string;
  bookTitle: string;
};

const borrowSchema = new Schema<IBorrow>(
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
    receivedDate: {
      type: Date,
      required: false,
    },
    returnDate: {
      type: Date,
      required: false,
    },
    receivedState: {
      type: String,
      default: BookState.Correct,
      enum: BookState,
    },
    returnState: {
      type: String,
      default: BookState.Correct,
      enum: BookState,
    },
    borrowStatus: {
      type: String,
      default: BorrowStatus.OnHold,
      enum: BorrowStatus,
    },
  },
  {
    timestamps: true,
  }
);

borrowSchema.pre("save", async function (next) {
  const user = await User.findById(this.userId);
  const book = await Book.findById(this.bookId);
  if (user == null || book == null) {
    throw new Error("User or Book doesn't exist");
  }
  if (book.status == BookStatus.Unavailable) {
    throw new Error("Book is not available");
  }
  next()
});

const Borrow = mongoose.model(CollectionName.Borrows, borrowSchema);

export default Borrow;
