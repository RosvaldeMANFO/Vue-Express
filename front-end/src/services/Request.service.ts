import axios from 'axios'
import { useSessionStore } from '../store'

export interface IRequest {
    _id: string
    userId: string
    bookId: string
    collectionId: string
    userEmail: string
    bookIsbn: string
    bookTitle: string
    receivingDate?: Date
    returningDate?: Date
    returningState: string
    receivingState: string
    requestStatus: string
    createdAt: Date
    updatedAt: Date
}

export type RequestInput = {
    userId: string
    bookId: string
    collectionId: string
    userEmail: string
    bookIsbn: string
    bookTitle: string
}

export enum RequestStatus {
    Approved = 'APPROVED',
    ToReturn = 'TO RETURN',
    OnHold = 'ON HOLD',
    Returned = 'RETURNED',
    Canceled = 'CANCELED',
}

export enum BookState {
    New = 'BRAND NEW',
    Correct = 'CORRECT',
    Worn = 'DAMAGED',
}

export class RequestService {
    private baseUrl = import.meta.env.VITE_API_BASE
    private session = useSessionStore()

    async sendRequest(data: RequestInput): Promise<void> {
        const url = `${this.baseUrl}/request/create`
        try {
            const result = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.session.token}`,
                },
            })
            return result.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async getAllRequest(): Promise<IRequest[]> {
        const url = `${this.baseUrl}/request/all`
        try {
            const result = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.session.token}`,
                },
            })
            return result.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async updateRequest(request: IRequest): Promise<string> {
        const url = `${this.baseUrl}/request/${request._id}`
        try {
            const result = await axios.put(url, request, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.session.token}`,
                },
            })
            return result.data.message
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async getRequestByIdOrEmail(query: string): Promise<IRequest[]> {
        const url = `${this.baseUrl}/request/find`
        try {
            const result = await axios.post(
                url,
                { query },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.session.token}`,
                    },
                },
            )
            return result.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }
}
