import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

export default class UserController {
    constructor(private service: UserService) {}
  
    login = async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.service.login(req.body.email, req.body.password);
      res.locals.result = result
      next();
    };
  
    register = async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.service.register(
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.phoneNumber
      );
      res.locals.result = result
      next();
    };
  }