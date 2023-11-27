import { NextFunction, Request, Response } from "express";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import {
  HttpCode,
  RequestFailure,
  RequestSuccess,
} from "../utils/request_result";
import { Roles } from "../models/constants";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export type Payload = {
  email: string,
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

class Authorization {
  secret: string = `${process.env.SECRET}`;
  verify = (requiredRole: Roles) => {
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

  validation = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token;
      const result = verify(token, this.secret);
      res.status(HttpCode.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  provideToken(payload: {}): string {
    const token: string = sign(payload, this.secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    return token;
  }
}

export const Access = new Authorization();
