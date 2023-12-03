import { compareSync, genSaltSync, hashSync } from 'bcrypt'

export default class Utils {
    static async encrypt(value: string): Promise<string> {
        const salt = genSaltSync(10)
        const encrypted = hashSync(value, salt)
        return encrypted
    }

    static async compareEncrypted(value: string, encrypted: string): Promise<boolean> {
        return compareSync(value, encrypted)
    }

    static isValidDate(value: string) {
        return !isNaN(Date.parse(value))
    }

    static passwordValidator(value: string): boolean {
        const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[(&@!#^/)]).{8,}/
        return pattern.test(value)
    }

    static emailValidator(value: string): boolean {
        const pattern = /^[a-z0-9A-Z]+@[a-z]+\.[a-z]{2,3}$/
        return pattern.test(value)
    }

    static cleanFilterOptions(options: Map<string, unknown>): Map<string, unknown>[] {
        const result: Map<string, unknown>[] = []
        Object.entries(options).forEach((element) => {
            if (element[1].length != 0) {
                if (Utils.isValidDate(element[1])) {
                    const date = new Date(element[1]).setHours(0, 0, 0, 0)
                    const ct = new Map<string, unknown>([[element[0], new Date(date)]])
                    result.push(ct)
                } else {
                    const ct = new Map<string, unknown>([
                        [element[0], { $regex: new RegExp(`.*${element[1]}.*`, 'i') }],
                    ])
                    result.push(ct)
                }
            }
        })
        return result
    }

    static isValidInput(input: string | Uint8Array | number): boolean {
        if (typeof input === 'string') {
            const hexStringRegex = /^[0-9a-fA-F]{24}$/
            if (hexStringRegex.test(input)) {
                return true
            }
        } else if (input instanceof Uint8Array) {
            if (input.length === 12) {
                return true
            }
        } else if (typeof input === 'number' && Number.isInteger(input)) {
            return true
        }

        return false
    }
}
