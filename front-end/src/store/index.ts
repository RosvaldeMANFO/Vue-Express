import { defineStore } from "pinia";

export type Payload = {
    token: string,
    email: string,
    userId: string,
    role: string,
    iat: 0,
    exp: 0,
}

export const useSessionStore = defineStore("session",{
  state: (): Payload => ({
    token: "",
    email: "",
    userId: "",
    role: "",
    iat: 0,
    exp: 0,
  }),
});

