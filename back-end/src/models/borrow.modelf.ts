import mongoose, { Schema } from "mongoose";
import { BookStates, BorrowStatus, Roles } from "./constants";

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
    types: String,
    unique: true,
  },
  receivedDate: {
    types: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  receivedState: {
    types: String,
    default: BookStates.Correct,
    enum: BookStates
  },
  returnState: {
    types: String,
    default: BookStates.Correct,
    enum: BookStates
  },
  borrowStatus: {
    types: String,
    default: BorrowStatus.Waiting,
    enum: BorrowStatus
  }
},
{
  timestamps: true,
});


const Borrow = mongoose.model("Borrows", borrowSchema);

export default Borrow;
