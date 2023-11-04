import Book, { BookInput, FilterOption, IBook } from "../models/book.model";
import { RequestSuccess, HttpCode } from "../utils/request_result";
import Utils from "../utils/utils";

export interface IBookService {
  registerBook(book: BookInput): Promise<void>;
  updateBook(id: string, newBook: BookInput): Promise<void>;
  getAllBooks(): Promise<RequestSuccess<IBook[]>>;
  deleteBook(bookId: string): Promise<void>;
  findBook(filterOptions: FilterOption): Promise<RequestSuccess<IBook[]>>;
}

export class BookService implements IBookService {
  async registerBook(book: BookInput): Promise<void> {
    await Book.create(book);
  }

  async updateBook(bookId: string, newBook: BookInput): Promise<void> {
    await Book.findByIdAndUpdate(bookId, newBook);
  }

  async getAllBooks(): Promise<RequestSuccess<IBook[]>> {
    const result = await Book.find();
    return new RequestSuccess(HttpCode.OK, result, "Getting all books");
  }

  async deleteBook(bookId: string): Promise<void> {
    await Book.findByIdAndDelete(bookId);
  }

  async findBook(
    filterOptions: FilterOption
  ): Promise<RequestSuccess<IBook[]>> {
    const options = this.cleanFilterOptions(filterOptions)
    console.log(options)
    const result = await Book.find({
      $or: options,
    });
    return new RequestSuccess(HttpCode.OK, result, "");
  }

  private cleanFilterOptions(options: FilterOption): Map<string, any>[] {
    let result: Map<string, any>[] = [];
    Object.entries(options).forEach((element) => {
      if (element[1].length != 0) {
        if (Utils.isValidDate(element[1])) {
          const ct = new Map<string, string>([[element[0], element[1]]]);
          result.push(ct);
        } else {
          const ct = new Map<string, any>([
            [element[0], { $regex: new RegExp(`.*${element[1]}.*`, "i") }],
          ]);
          result.push(ct);
        }
      }
    });
    return result;
  }
}
