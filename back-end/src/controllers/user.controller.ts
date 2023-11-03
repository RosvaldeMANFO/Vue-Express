import { NextFunction, Request, Response } from "express";
import { IUserService } from "../services/user.service";
import { HttpCode, RequestSuccess } from "../utils/request_result";

export default class UserController {
  constructor(private service: IUserService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(
        req.body.email,
        req.body.password
      );
      res.status(result.httpCode).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.register(req.body);
      res.status(HttpCode.OK).json({ message: "User registered" });
    } catch (err) {
      next(err);
    }
  };
}
