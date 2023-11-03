import { HttpCode, RequestSuccess } from "../utils/request_result";
import Book from "../models/book.model";
import { BookStatus, BorrowStatus } from "../models/constants";
import Borrow, { BorrowInput, IBorrow } from "../models/borrow.model";
import BookCopies from "../models/book_copies.model";

export interface IBorrowService {
  createBorrow(borrow: BorrowInput): Promise<void>;
  updateBorrow(borrowId: string, borrow: IBorrow): Promise<void>;
  deleteBorrow(borrowId: string): Promise<void>;
  getAllBorrow(): Promise<RequestSuccess<IBorrow[]>>;
  getBorrowByEmail(email: string): Promise<RequestSuccess<IBorrow[]>>;
}

export class BorrowService implements IBorrowService {
  async createBorrow(borrow: BorrowInput): Promise<void> {
    await Borrow.create(borrow);
  }

  async updateBorrow(borrowId: string, borrow: IBorrow): Promise<void> {
    await Borrow.findByIdAndUpdate(borrowId, borrow);
    try {
      await this.updateStock(borrowId, borrow.bookId, borrow.borrowStatus);
    } catch (err) {
      throw err;
    }
  }

  async deleteBorrow(borrowId: string): Promise<void> {
    await Borrow.findByIdAndDelete(borrowId);
  }

  async getAllBorrow(): Promise<RequestSuccess<IBorrow[]>> {
    const result = await Borrow.find();
    return new RequestSuccess(HttpCode.OK, result, "Getting all borrow");
  }

  async getBorrowByEmail(email: string): Promise<RequestSuccess<IBorrow[]>> {
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
      borrowStatus == BorrowStatus.Approved &&
      borrow?.borrowStatus != BorrowStatus.Approved
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
      borrowStatus == BorrowStatus.Returned &&
      borrow?.borrowStatus != BorrowStatus.Returned
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
