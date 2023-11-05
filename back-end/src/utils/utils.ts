import { compareSync, genSaltSync, hashSync } from "bcrypt";

export default class Utils {
  static async encrypt(value: string): Promise<string> {
    const salt = genSaltSync(10);
    const encrypted = hashSync(value, salt);
    return encrypted;
  }

  static async compareEncrypted(
    value: string,
    encrypted: string
  ): Promise<boolean> {
    return compareSync(value, encrypted);
  }

  static isValidDate(value: string) {
    return !isNaN(Date.parse(value));
  }

  static passwordValidator(value: string): boolean{
    const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[(&@!#^/)]).{8,}/
    return pattern.test(value)
  }

  static emailValidator(value: string): boolean{
    const pattern = /^[a-z0-9A-Z]+@[a-z]+\.[a-z]{2,3}$/
    return pattern.test(value)
  }
}
