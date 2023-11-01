import ApplicationService from "../services"
import UserController from "./user.controller"

export default class ApplicationController{
    userController!: UserController

    constructor(private services: ApplicationService){
        this.initializeControllers()
    }

    private initializeControllers(): void {
        this.userController = new UserController(this.services.userService)
    }
}