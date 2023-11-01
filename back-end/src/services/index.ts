import { Db } from "mongodb";
import { CollectionName } from "../models";
import { UserService,UserServiceImplementation } from "./user.service";

export default class ApplicationService{
    userService!: UserService
    
    constructor(private database: Db){
        this.initializeServices()
    }

    private initializeServices(){
        this.userService = new UserServiceImplementation(
            this.database.collection(CollectionName.USERS)
        )
    }
    
}