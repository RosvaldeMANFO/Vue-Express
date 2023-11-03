import { Types } from "mongoose";
import Borrow, { BorrowInput, IBorrow } from "../models/borrow.modelf";
import { HttpCode, RequestSuccess } from "../utils/request_result";

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
    const objectId = new Types.ObjectId(borrowId);
    await Borrow.findByIdAndUpdate({ _id: objectId }, objectId);
  }

  async deleteBorrow(borrowId: string): Promise<void> {
    await Borrow.findByIdAndDelete(borrowId);
  }

  async getAllBorrow(): Promise<RequestSuccess<IBorrow[]>> {
    const result = await Borrow.find();
    return new RequestSuccess(HttpCode.OK, result, "Getting all borrow");
  }

  async getBorrowByEmail(email: string): Promise<RequestSuccess<IBorrow[]>> {
    const result = await Borrow.find({userEmail: email});
    return new RequestSuccess(HttpCode.OK, result, `Getting borrow of ${email}`);
  }
}
