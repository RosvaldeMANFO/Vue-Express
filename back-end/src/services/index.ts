import { BookService, IBookService } from "./book.service";
import { BorrowService, IBorrowService } from "./borrow.service";
import { IUserService,UserService } from "./user.service";

export default class ApplicationService{
    userService!: IUserService
    bookService!: IBookService
    borrowService!: IBorrowService
    
    constructor(){
        this.initializeServices()
    }

    private initializeServices(){
        this.userService = new UserService()
        this.bookService = new BookService()
        this.borrowService = new BorrowService()
    }
    
}