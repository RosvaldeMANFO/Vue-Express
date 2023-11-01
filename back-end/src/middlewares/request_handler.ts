import {NextFunction, Request, Response } from "express";
import {
  ErrorResult,
  SuccessResult,
} from "../utils/request_result";

const requestHandler = (req: Request, res: Response) => {
    let result = res.locals.result;
    console.log(result)
    if (result instanceof ErrorResult) {
      res.status(result.httpCode).json(result);
    } else {
      let success = result as SuccessResult<any>;
      res.status(success.httpCode).json(success);
    }
  };

const logger = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`${req.path} ${res.statusCode}`);
    next();
  }

export {requestHandler, logger}