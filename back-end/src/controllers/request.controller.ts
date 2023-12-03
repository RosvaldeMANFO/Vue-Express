import { NextFunction, Request, Response } from 'express'
import { IRequestService } from '../services/request.service'
import { HttpCode } from '../utils/request_result'

export default class BorrowController {
    constructor(private service: IRequestService) {}

    createRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.createRequest(req.body)
            res.status(HttpCode.OK).json({ message: 'New borrowing requested' })
        } catch (err) {
            next(err)
        }
    }

    updateRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            await this.service.updateRequest(req.params.requestId, req.body)
            res.status(HttpCode.OK).json({ message: `Borrowing ${req.params.requestId} updated` })
        } catch (err) {
            next(err)
        }
    }

    getAllRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.getAllRequest()
            res.status(HttpCode.OK).json(result.data)
        } catch (err) {
            next(err)
        }
    }

    deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.deleteRequest(req.params.requestId)
        } catch (err) {
            next(err)
        }
    }

    getRequestByIdOrEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.getRequestByIdOrEmail(req.body.query)
            res.status(HttpCode.OK).json(result.data)
        } catch (err) {
            next(err)
        }
    }
}
