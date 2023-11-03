import mongoose, { Schema } from "mongoose";
import { BookState, BorrowStatus, CollectionName } from "./constants";

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
  borrowStatus: string
}

const borrowSchema = new Schema<IBorrow>({
  userId: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
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
    unique: true,
  },
  receivedDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  receivedState: {
    type: String,
    default: BookState.Correct,
    enum: BookState
  },
  returnState: {
    type: String,
    default: BookState.Correct,
    enum: BookState
  },
  borrowStatus: {
    type: String,
    default: BorrowStatus.Waiting,
    enum: BorrowStatus
  }
},
{
  timestamps: true,
});


const Borrow = mongoose.model(CollectionName.Borrows, borrowSchema);

export default Borrow;
