import mongoose, { Schema } from "mongoose";
import {
  BookState,
  BookStatus,
  BorrowingStatus,
  CollectionName,
} from "./constants";
import User from "./user.model";
import Book from "./book.model";

export interface IBorrowing extends Document {
  userId: string;
  bookId: string;
  collectionId: string;
  userEmail: string;
  bookIsbn: string;
  bookTitle: string;
  receivedDate?: Date;
  returnDate?: Date;
  returnState: string;
  receivedState: string;
  borrowStatus: string;
}

export type BorrowingInput = {
  userId: string;
  bookId: string;
  collectionId: string;
  userEmail: string;
  bookIsbn: string;
  bookTitle: string;
};

const borrowSchema = new Schema<IBorrowing>(
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
    collectionId: {
      type: String,
      ref: CollectionName.BookCollection,
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
      default: null,
    },
    returnDate: {
      type: Date,
      required: false,
      default: null,
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
      default: BorrowingStatus.OnHold,
      enum: BorrowingStatus,
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

  const exists = await Borrowing.find({
    userId: this.userId,
    bookTitle: this.bookTitle,
  });
  const status = new Set([
    BorrowingStatus.Canceled.valueOf(),
    BorrowingStatus.Returned.valueOf(),
  ]);
  if (!exists.every((element) => status.has(element.borrowStatus))) {
    throw new Error("You already have a request for this book");
  }

  next();
});

const Borrowing = mongoose.model(CollectionName.Borrows, borrowSchema);

export default Borrowing;
