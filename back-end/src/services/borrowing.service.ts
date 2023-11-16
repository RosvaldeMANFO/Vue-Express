import {
  HttpCode,
  RequestFailure,
  RequestSuccess,
} from "../utils/request_result";
import Book from "../models/book.model";
import { BookStatus, BorrowingStatus } from "../models/constants";
import Borrow, { BorrowingInput, IBorrowing } from "../models/borrowing.model";
import BookCopies from "../models/book_copies.model";

export interface IBorrowingService {
  createBorrowing(borrow: BorrowingInput): Promise<void>;
  updateBorrowing(borrowId: string, borrow: IBorrowing): Promise<void>;
  deleteBorrowing(borrowId: string): Promise<void>;
  getAllBorrowings(): Promise<RequestSuccess<IBorrowing[]>>;
  getBorrowingByEmail(email: string): Promise<RequestSuccess<IBorrowing[]>>;
}

export class BorrowingService implements IBorrowingService {
  async createBorrowing(borrow: BorrowingInput): Promise<void> {
    const exists = await Borrow.find({
      userId: borrow.userId,
      bookTitle: borrow.bookTitle,
    });
    const status = new Set([
      BorrowingStatus.Canceled.valueOf(),
      BorrowingStatus.Returned.valueOf(),
    ]);
    if (!exists.every((element) => status.has(element.borrowStatus))) {
      throw new RequestFailure(
        HttpCode.UNAUTHORIZED,
        "You already have a request for this book",
        "You can not emit multiple request fo the same book"
      );
    }
    await Borrow.create(borrow);
  }

  async updateBorrowing(borrowId: string, borrow: IBorrowing): Promise<void> {
    await Borrow.findByIdAndUpdate(borrowId, borrow);
    await this.updateStock(borrowId, borrow.bookId, borrow.borrowStatus);
  }

  async deleteBorrowing(borrowId: string): Promise<void> {
    await Borrow.findByIdAndDelete(borrowId);
  }

  async getAllBorrowings(): Promise<RequestSuccess<IBorrowing[]>> {
    const result = await Borrow.find();
    return new RequestSuccess(HttpCode.OK, result, "Getting all borrow");
  }

  async getBorrowingByEmail(
    email: string
  ): Promise<RequestSuccess<IBorrowing[]>> {
    const result = await Borrow.find({ userEmail: email });
    return new RequestSuccess(
      HttpCode.OK,
      result,
      `Getting borrow of ${email}`
    );
  }

  private async updateStock(
    borrowId: string,
    bookId: string,
    borrowStatus: string
  ): Promise<void> {
    const book = await Book.findById(bookId);
    const stock = await BookCopies.findById(book?.copy);
    const borrow = await Borrow.findById(borrowId);
    if (
      borrowStatus == BorrowingStatus.Approved &&
      borrow?.borrowStatus != BorrowingStatus.Approved
    ) {
      await BookCopies.findByIdAndUpdate(stock!.id, {
        quantity: stock!.quantity - 1,
      });
      await Book.findByIdAndUpdate(bookId, {
        status:
          stock!.quantity - 1 == 0
            ? BookStatus.Unavailable
            : BookStatus.Available,
      });
    }
    if (
      borrowStatus == BorrowingStatus.Returned &&
      borrow?.borrowStatus != BorrowingStatus.Returned
    ) {
      await BookCopies.findByIdAndUpdate(stock!.id, {
        quantity: stock!.quantity + 1,
      });
      await Book.findByIdAndUpdate(bookId, {
        status: BookStatus.Available,
      });
    }
  }
}
