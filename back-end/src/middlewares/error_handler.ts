import { NextFunction, Request, Response } from "express";
import { HttpCode, RequestFailure } from "../utils/request_result";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  if (err instanceof RequestFailure) {
    res.status(err.httpCode).json({
      status: err.httpCode,
      message: err.message,
      description: err.description
    });
  } else {
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({
        status: 500,
        message: err.message
      });
  }
  next();
};
