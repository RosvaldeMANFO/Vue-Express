import { BookService, IBookService } from "./book.service";
import { BookCopiesService, IBookCopiesService } from "./book_copies.service";
import { BorrowingService, IBorrowingService } from "./borrowing.service";
import { IUserService,UserService } from "./user.service";

export default class ApplicationService{
    userService!: IUserService
    bookService!: IBookService
    borrowService!: IBorrowingService
    bookCpService!: IBookCopiesService
    
    constructor(){
        this.initializeServices()
    }

    private initializeServices(){
        this.userService = new UserService()
        this.bookService = new BookService()
        this.borrowService = new BorrowingService()
        this.bookCpService = new BookCopiesService()
    }
    
}