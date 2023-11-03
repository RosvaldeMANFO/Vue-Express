import { NextFunction, Request, Response } from "express";
import { BorrowService } from "../services/borrow.service";
import { HttpCode } from "../utils/request_result";

export default class BorrowController {
  constructor(private service: BorrowService) {}

  createBorrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.createBorrow(req.body);
      res.status(HttpCode.OK).json({ message: "New borrow requested" });
    } catch (err) {
      next(err);
    }
  };

  updateBorrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.updateBorrow(req.params.borrowId, req.body);
      res
        .status(HttpCode.OK)
        .json({ message: `Borrow ${req.params.borrowId} updated` });
    } catch (err) {
      next(err);
    }
  };

  getAllBorrows = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllBorrow();
      res.status(HttpCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  deleteBorrow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteBorrow(req.params.borrowId);
    } catch (err) {
      next(err);
    }
  };

  getBorrowByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = this.service.getBorrowByEmail(req.params.userEmail);
      res.status(HttpCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  };
}
