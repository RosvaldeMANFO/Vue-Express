import { Types, Document } from "mongoose";
import Book, { FilterOption, IBook } from "../models/book.model";
import BookCollection, {
  IBookCollection,
} from "../models/book_collection.model";
import { RequestSuccess, HttpCode } from "../utils/request_result";
import Utils from "../utils/utils";

export type OutPutBook = {
  book: IBook;
  collection: IBookCollection;
};

export interface IBookService {
  getBookById(bookId: string): Promise<RequestSuccess<OutPutBook>>;
  registerBook(book: IBook): Promise<void>;
  updateBook(id: string, newBook: IBook): Promise<void>;
  getAllBook(): Promise<RequestSuccess<OutPutBook[]>>;
  deleteBook(bookId: string): Promise<void>;
  findBookByISBN(isbn: string): Promise<RequestSuccess<OutPutBook[]>>;
  findBook(
    filterOptions: Map<string, unknown>
  ): Promise<RequestSuccess<OutPutBook[]>>;
}

export class BookService implements IBookService {
  async getBookById(bookId: string): Promise<RequestSuccess<OutPutBook>> {
    const book = await Book.findById(bookId);
    const collection = await BookCollection.findById(book?.collectionId);
    const result: OutPutBook = {
      book: book as IBook,
      collection: collection as IBookCollection,
    };
    return new RequestSuccess(
      HttpCode.OK,
      result,
      `Retrieving book with ID ${bookId}`
    );
  }

  async registerBook(book: IBook): Promise<void> {
    await Book.create(book);
    this.updateCollectionQuantity(book.collectionId, 1);
  }

  async updateBook(bookId: string, newBook: IBook): Promise<void> {
    const oldBook = await Book.findById(bookId);
    await Book.findByIdAndUpdate(bookId, newBook);
    if (oldBook?.collectionId != newBook.collectionId) {
      await this.updateCollectionQuantity(oldBook?.collectionId!, -1);
      await this.updateCollectionQuantity(newBook.collectionId, 1);
    }
  }

  async getAllBook(): Promise<RequestSuccess<OutPutBook[]>> {
    const books = await Book.find();
    const collections = await BookCollection.find();
    const result = await this.bindCollection(books, collections);
    console.log(JSON.stringify(result));
    return new RequestSuccess(HttpCode.OK, result, "Getting all books");
  }

  async deleteBook(bookId: string): Promise<void> {
    const book = await Book.findById(bookId);
    await Book.findByIdAndDelete(bookId);
    await this.updateCollectionQuantity(book?.collectionId!, -1);
  }

  async findBook(
    filterOptions: Map<string, unknown>
  ): Promise<RequestSuccess<OutPutBook[]>> {
    const options = Utils.cleanFilterOptions(filterOptions);
    const books = await Book.find();
    const collections = await BookCollection.find({ $or: options });
    const result = (await this.bindCollection(books, collections)).sort(
      (a, b) => a.collection.title.localeCompare(b.collection.title)
    );
    return new RequestSuccess(HttpCode.OK, result, "");
  }

  async findBookByISBN(isbn: string): Promise<RequestSuccess<OutPutBook[]>> {
    const books = await Book.find({ isbn: { $regex: new RegExp(isbn, "i") } });
    const collections = await BookCollection.find();
    const result = (await this.bindCollection(books, collections)).sort(
      (a, b) => a.collection.title.localeCompare(b.collection.title)
    );
    return new RequestSuccess(
      HttpCode.OK,
      result,
      `Finding book with ISBN like ${isbn}`
    );
  }

  private async updateCollectionQuantity(
    collectionId: string,
    quantity: number
  ) {
    const collection = await BookCollection.findById(collectionId);
    await BookCollection.findByIdAndUpdate(collection?.id, {
      quantity: collection?.quantity! + quantity,
    });
  }

  private async bindCollection(
    books: IBook[],
    collections: (Document<unknown, {}, IBookCollection> &
      IBookCollection & {
        _id: Types.ObjectId;
      })[]
  ): Promise<Array<OutPutBook>> {
    let result: Array<OutPutBook> = [];
    books.forEach((element) => {
      const collection = collections.filter(
        (value) => value._id.toString() == element.collectionId
      )[0];
      result.push({
        collection,
        book: element,
      });
    });
    return result;
  }
}
