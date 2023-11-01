import { NextFunction, Request } from "express";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { ErrorResult, HttpCode } from "../utils/request_result";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export default class Auth {
  private static secret: string = `${process.env.SECRET}`;

  static verifyJwt(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw Error();
      }
      const decoded = verify(token, this.secret);
      (req as CustomRequest).token = decoded;
      next();
    } catch (error) {
      throw new ErrorResult(
        HttpCode.UNAUTHORIZED,
        "Access denied",
        "You are allowed to access to this resource"
      );
    }
  }

  static provideToken(email: string): string {
    const token = sign({email: email }, this.secret, {
      expiresIn: "2 days",
    });
    return token;
  }
}
