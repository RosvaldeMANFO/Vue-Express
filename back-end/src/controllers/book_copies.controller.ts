import { NextFunction, Request, Response } from "express";
import { IBookCopiesService } from "../services/book_copies.service";

export class BookCopiesController {
  constructor(private service: IBookCopiesService) {}

  getAllBookCopies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.service.getAll();
      res.status(result.httpCode).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  deleteStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getById(req.params.stockId);
      if (result != null && result?.data?.quantity != 0) {
        throw new Error("This collection still contains books");
      }
      await this.service.deleteStock(req.params.stockId);
    } catch (err) {
      next(err);
    }
  };
}
