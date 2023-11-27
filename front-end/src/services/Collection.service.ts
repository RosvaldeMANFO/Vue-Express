import axios from "axios";
import { useSessionStore } from "../store";

export type BookCollection = {
  _id?: string;
  title: string;
  genre: string;
  author: string;
  publicationDate: Date;
  publishingHouse: string;
  bookCover?: string;
  quantity?: number;
  createAt?: Date;
  updatedAt?: Date;
};

export class CollectionService {
  private baseUrl = import.meta.env.VITE_API_BASE;

  async getAllCollection(): Promise<BookCollection[]> {
    const url = `${this.baseUrl}/collection/all`;
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

  async createCollection(data: {}): Promise<void> {
    const url = `${this.baseUrl}/collection/create`;
    const session = useSessionStore();
    try {
      const result = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      return result.data.message;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async updateCollection(collection: BookCollection): Promise<void> {
    const url = `${this.baseUrl}/collection/${collection._id}`;
    const session = useSessionStore();
    try {
      const result = await axios.put(url, collection, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      return result.data.message;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async deleteCollection(collectionId: string): Promise<string> {
    const url = `${this.baseUrl}/collection/${collectionId}`;
    const session = useSessionStore();
    try {
      const result = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      return result.data.message;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async findCollection(query: {}): Promise<BookCollection[]> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/collection/find`;
    try {
      const result = await axios.post(
        url,
        { isbn: query },
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
      throw err;
    }
  }
}
