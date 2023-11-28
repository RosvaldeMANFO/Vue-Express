import axios from "axios";
import { useSessionStore } from "../store";

export type Borrow = {
  _id: string;
  bookIsbn: string;
  bookTitle: string;
  receivedState: string;
  returnState: string;
  borrowStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Reader = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export class UserService {
  private baseUrl = import.meta.env.VITE_API_BASE;

  async login(email: string, password: string): Promise<unknown> {
    const url = `${this.baseUrl}/user/login`;
    try {
      const result = await axios.post(
        url,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return {
        ...result.data.payload,
        token: result.data.token,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<unknown> {
    const url = `${this.baseUrl}/user/register`;
    try {
      const result = await axios.post(
        url,
        { fullName, email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return result.data.message;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message ?? "";
        throw Error(message);
      }
      throw err;
    }
  }

  async tokenValidation(token: string): Promise<unknown> {
    const url = `${this.baseUrl}/user/verify_token`;
    try {
      const result = await axios.post(
        url,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

  async getAllRequest(): Promise<Array<Borrow>> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/user/history/${session.userId}`;
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return result.data.borrow;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async sendRequest(bookId: string) {
    const session = useSessionStore();
    const url = `${this.baseUrl}/history/${session.userId}`;
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return result.data as Borrow;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async cancelRequest(requestId: string): Promise<string> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/user/cancel`;
    try {
      const result = await axios.post(
        url,
        { requestId: requestId },
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

  async getAllReader(): Promise<Array<Reader>> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/user/all`;
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
        const message: string = err?.response?.data.message;
        throw Error(message);
      }
      throw err;
    }
  }

  async findReader(query: {}): Promise<Array<Reader>> {
    const session = useSessionStore();
    const url = `${this.baseUrl}/user/find`;
    try {
      const result = await axios.post(url, query, {
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
}
