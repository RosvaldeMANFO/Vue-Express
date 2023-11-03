import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HttpCode } from "../utils/request_result";

export default class UserController {
  constructor(private service: UserService) {}

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

  register = (req: Request, res: Response, next: NextFunction) => {
    this.service
      .register(req.body.username, req.body.email, req.body.password)
      .then((result) => {
        res.status(HttpCode.OK).json(result);
      })
      .catch((error) => {
        next(error);
      });
  };
}
