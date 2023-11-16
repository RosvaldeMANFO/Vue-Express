import axios from "axios";
import { useSessionStore } from "../store";

export enum LiteralGender {
  Narrative = "NARRATIVE",
  Theatrical = "THEATRICAL",
  Poetic = "POETIC",
  Argumentative = "ARGUMENTATIVE",
  Epistolary = "EPISTOLARY",
  Neutral = "NEUTRAL",
}

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

export type BookCopy = {
  _id: string;
  title: string;
  quantity: number;
};

export type BorrowInput = {
  userId: string;
  bookId: string;
  userEmail: string;
  bookIsbn: string;
  bookTitle: string;
};

export type BookInput = {
  isbn: string;
  title: string;
  genre: string;
  author: string;
  publicationDate: Date;
  publishingHouse: string;
};

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

  async registerBook(data: BookInput, newStock: boolean) {
    const session = useSessionStore();
    const url = `${this.baseUrl}/book/create?initDoc=${newStock}`;
    try {
      const result = await axios.post(
        url,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async updateBook(data: Book) {
    const session = useSessionStore();
    const url = `${this.baseUrl}/book/${data._id}`;
    try {
      const result = await axios.put(
        url,
        { ...data },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async deleteBook(id: string){
    const session = useSessionStore();
    const url = `${this.baseUrl}/book/${id}`;
    try {
      const result = await axios.delete(
        url,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
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
    const url = `${this.baseUrl}/borrowing/create`;
    try {
      const result = await axios.post(url, data, {
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

  async searchBook(data: {}): Promise<Array<Book>> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/book/find`;
    try {
      const result = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  async getAllCopies(): Promise<Array<BookCopy>> {
    const url = `${this.baseUrl}/book_copies/all`;
    const session = useSessionStore();
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.message;
        throw Error(message);
      }
      throw err;
    }
  }
}
