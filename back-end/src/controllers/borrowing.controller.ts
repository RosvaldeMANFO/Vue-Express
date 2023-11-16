import { NextFunction, Request, Response } from "express";
import { IBorrowingService } from "../services/borrowing.service";
import { HttpCode } from "../utils/request_result";

export default class BorrowController {
  constructor(private service: IBorrowingService) {}

  createBorrowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.createBorrowing(req.body);
      res.status(HttpCode.OK).json({ message: "New borrow requested" });
    } catch (err) {
      next(err);
    }
  };

  updateBorrowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.updateBorrowing(req.params.borrowId, req.body);
      res
        .status(HttpCode.OK)
        .json({ message: `Borrow ${req.params.borrowId} updated` });
    } catch (err) {
      next(err);
    }
  };

  getAllBorrowings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllBorrowings();
      res.status(HttpCode.OK).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  deleteBorrowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteBorrowing(req.params.borrowId);
    } catch (err) {
      next(err);
    }
  };

  getBorrowingByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.service.getBorrowingByEmail(req.params.userEmail);
      res.status(HttpCode.OK).json(result.data);
    } catch (err) {
      next(err);
    }
  };
}
