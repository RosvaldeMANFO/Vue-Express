import axios from 'axios'
import { useSessionStore } from '../store'
import { BookCollection } from './Collection.service'
import Utils from '../utils'

export type BookAggregation = {
    books: Book[]
    collection: BookCollection
}

export enum LiteralGender {
    Narrative = 'NARRATIVE',
    Theatrical = 'THEATRICAL',
    Poetic = 'POETIC',
    Argumentative = 'ARGUMENTATIVE',
    Epistolary = 'EPISTOLARY',
    Neutral = 'NEUTRAL',
}

export type Book = {
    _id?: string
    isbn: string
    collectionId?: string
    status?: string
    state?: string
    createAt?: Date
    updatedAt?: Date
}

export type BookMapped = {
    book: Book
    collection: BookCollection
}

export class BookService {
    private baseUrl = import.meta.env.VITE_API_BASE

    async getBookById(bookId: string): Promise<BookMapped> {
        const url = `${this.baseUrl}/book/${bookId}`
        try {
            const result = await axios.get(url)
            return result.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async getAllBook(): Promise<Array<BookMapped>> {
        const url = `${this.baseUrl}/book/all`
        try {
            const result = await axios.get(url)
            return result.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async registerBook(data: BookMapped, newCollection: boolean) {
        const session = useSessionStore()
        const url = `${this.baseUrl}/book/create?initCollection=${newCollection}`
        try {
            const result = await axios.post(
                url,
                { ...data },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${session.token}`,
                    },
                },
            )
            return result.data.message
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async updateBook(data: BookMapped) {
        const session = useSessionStore()
        const url = `${this.baseUrl}/book/${data.book._id}`
        try {
            const result = await axios.put(
                url,
                { ...data },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${session.token}`,
                    },
                },
            )
            return result.data.message
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message: string = err?.response?.data.message
                throw Error(message)
            }
            throw err
        }
    }

    async deleteBook(id: string) {
        const session = useSessionStore()
        const url = `${this.baseUrl}/book/${id}`
        try {
            const result = await axios.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${session.token}`,
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

    async findBookByISBN(query: string): Promise<BookMapped[]> {
        const session = useSessionStore()
        const url = `${this.baseUrl}/book/find`
        try {
            const result = await axios.post(
                url,
                { isbn: query },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${session.token}`,
                    },
                },
            )
            return result.data
        } catch (err) {
            throw err
        }
    }

    findBook(books: BookMapped[], query: string) {
        const result: BookMapped[] = []
        for (let i = 0; i < books.length; i++) {
            const add = this.iterateProperties(books[i], query)
            if (add) {
                result.push(books[i])
            }
        }
        return result
    }

    private iterateProperties(obj: any, query: string): boolean {
        const regxp = new RegExp(`\w*${query}\w*`, 'i')
        let match = false
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                match = this.iterateProperties(obj[key], query)
                break
            } else {
                if (Utils.isValidDate(query)) {
                    const date = new Date(query).setHours(0, 0, 0, 0)
                    if (
                        Utils.isValidDate(obj[key]) &&
                        new Date(obj[key]).toLocaleDateString() == new Date(date).toLocaleDateString()
                    ) {
                        match = true
                        break
                    }
                } else {
                    if (regxp.test(obj[key])) {
                        match = true
                        break
                    }
                }
            }
        }
        return match
    }
}
