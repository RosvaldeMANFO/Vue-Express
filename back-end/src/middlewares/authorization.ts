import { NextFunction, Request, Response } from "express";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { HttpCode, RequestFailure } from "../utils/request_result";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export type Payload = {
  userId: string;
  email: string;
  role: string;
};

class Authorization {
  secret: string = `${process.env.SECRET}`;
  verify = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
          throw new RequestFailure(
            HttpCode.UNAUTHORIZED,
            "Access denied",
            "You are allowed to access to this resource"
          );
        }
        const payload = verify(token, this.secret) as Payload;

        if (payload.role !== requiredRole) {
          throw new RequestFailure(
            HttpCode.UNAUTHORIZED,
            "Access denied",
            "You do not have necessary privileges to access to this resource"
          );
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  };

  provideToken(payload: Payload): string {
    const token: string = sign(payload, this.secret, {
      expiresIn: "1h",
    });
    return token;
  }
}

export const Access = new Authorization();
