import axios from "axios";
import { useSessionStore } from "../store";



export type BorrowInput = {
    userId: string;
    bookId: string;
    userEmail: string;
    bookIsbn: string;
    bookTitle: string;
  };

export class BorrowingService{
    private baseUrl = import.meta.env.VITE_API_BASE;
    
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
}