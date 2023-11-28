import { NextFunction, Request, Response } from "express";
import { IBookCollectionService } from "../services/book_collection.service";
import { HttpCode } from "../utils/request_result";

export class BookCollectionController {
  constructor(private service: IBookCollectionService) {}

  createCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.service.createCollection(req.body);
      res
        .status(HttpCode.OK)
        .json({ message: `Collection ${result} created successfully` });
    } catch (err) {
      next(err);
    }
  };

  updateCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.updateCollection(req.params.collectionId, req.body);
      res
        .status(HttpCode.OK)
        .json({
          message: `Collection ${req.params.collectionId} updated successfully`,
        });
    } catch (err) {
      next(err);
    }
  };

  getAllCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.service.getAllCollection();
      res.status(result.httpCode).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  deleteCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.deleteCollection(req.params.collectionId);
      res.status(HttpCode.OK).json({message: `Collection ${req.params.collectionId} deleted successfully`})
    } catch (err) {
      next(err);
    }
  };

  findCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findCollection(req.body);
      res.status(result.httpCode).json(result.data);
    } catch (err) {
      next(err);
    }
  };
}
