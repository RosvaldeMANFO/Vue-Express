import axios from "axios";
import { useSessionStore } from "../store";

export type Book = {
  _id: string;
  isbn: string;
  title: string;
  genre: string;
  author: string;
  bookCover?: string;
  publicationDate: Date;
  publishingHouse: string;
  copy: string;
  status: string;
  state: string;
  createAt: Date;
  updatedAt: Date;
};

export type BorrowInput = {
    userId: string,
    bookId: string,
    userEmail: string,
    bookIsbn: string,
    bookTitle: string,
}

export class BookService {
  private baseUrl = import.meta.env.VITE_API_BASE;

  async getAllBooks(): Promise<Array<Book>> {
    const url = `${this.baseUrl}/book/all`;
    try {
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async requestBorrow(data: BorrowInput): Promise<void> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/borrow/create`;
    try {
      const result = await axios.post(url, 
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        });
      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }
}
