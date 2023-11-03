import { NextFunction, Request, Response } from "express";
import { IBookService } from "../services/book.service";
import { HttpCode } from "../utils/request_result";

export default class BookController {
  constructor(private bookService: IBookService) {}

  createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      res.status(HttpCode.OK).json(books);
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.bookService.deleteBook(req.params.bookId);
      res.status(HttpCode.OK).json({message: `one book deleted`});
    }catch(err){
      next(err);
    }
  };

  findBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.findBook(req.body);
      res.status(HttpCode.OK).json(books);
    } catch(err){
      next(err);
    }
  };
}
