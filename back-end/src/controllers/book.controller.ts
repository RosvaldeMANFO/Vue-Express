import { NextFunction, Request, Response } from "express";
import { IBookService } from "../services/book.service";
import { HttpCode } from "../utils/request_result";
import { IBookCopiesService } from "../services/book_copies.service";
import BookCopies from "../models/book_copies.model";

export default class BookController {
  constructor(
    private bookService: IBookService,
    private bookCp: IBookCopiesService
  ) {}

  private validateTitle = async (req: Request): Promise<string> => {
    const initDoc = req.query.initDoc;
    if (initDoc === "true") {
      return await this.bookCp.createStock(req.body.title, 1);
    } else {
      const copy = await BookCopies.findOne({ title: req.body.title });
      if (!copy) {
        throw Error(
          "There is no stock with this title. To create new stock, you most alow it before first book registration"
        );
      }
      return copy.id;
    }
  };

  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.copy = await this.validateTitle(req);
      await this.bookService.registerBook(req.body);
      res
        .status(HttpCode.OK)
        .json({ message: `Book ${req.body.isbn} registered` });
    } catch (err) {
      next(err);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.copy = await this.validateTitle(req);
      await this.bookService.updateBook(req.params.bookId, req.body);
      res
        .status(HttpCode.OK)
        .json({ message: `Book ${req.body.isbn} updated` });
    } catch (err) {
      next(err);
    }
  };

  getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.status(HttpCode.OK).json(books.data);
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.bookService.deleteBook(req.params.bookId);
      res.status(HttpCode.OK).json({ message: `one book deleted` });
    } catch (err) {
      next(err);
    }
  };

  findBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bookService.findBook(req.body);
      res.status(result.httpCode).json(result.data);
    } catch (err) {
      next(err);
    }
  };
}
