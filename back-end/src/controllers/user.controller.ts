import { NextFunction, Request, Response } from "express";
import { IUserService } from "../services/user.service";
import { HttpCode } from "../utils/request_result";

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

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllUsers();
      res.status(result.httpCode).json(result);
    } catch (err) {
      next(err);
    }
  };

  getUserHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getUserHistory(req.params.userId);
      res.status(result.httpCode).json(result);
    } catch (err) {
      next(err);
    }
  };
}
