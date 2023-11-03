import { compareSync, genSaltSync, hashSync } from "bcrypt";

export default class Utils {
  static async encrypt(value: string): Promise<string> {
    let salt = genSaltSync(10);
    let encrypted = hashSync(value, salt);
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

}
