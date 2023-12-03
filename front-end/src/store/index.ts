import { defineStore } from 'pinia'

export type Payload = {
    token: string
    email: string
    userId: string
    role: string
    iat: number
    exp: number
}

export const useSessionStore = defineStore('session', {
    state: (): Payload => ({
        token: '',
        email: '',
        userId: '',
        role: '',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000),
    }),
})
