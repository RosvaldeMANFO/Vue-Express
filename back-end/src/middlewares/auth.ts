import { NextFunction, Request } from "express";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { HttpCode, RequestFailure } from "../utils/request_result";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export default class Auth {
  private static secret: string = `${process.env.SECRET}`;

  static verifyJwt(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new RequestFailure(
        HttpCode.UNAUTHORIZED,
        "Access denied",
        "You are allowed to access to this resource"
      );
    }
    const decoded = verify(token, this.secret);
    (req as CustomRequest).token = decoded;
    next();
  }

  static provideToken(email: string): string {
    const token = sign({ email: email }, this.secret, {
      expiresIn: "2 days",
    });
    return token;
  }
}
