import { BookService, IBookService } from "./book.service";
import { IBookCollectionService, BookCollectionService } from "./book_collection.service";
import { RequestService, IRequestService } from "./request.service";
import { IUserService,UserService } from "./user.service";

export default class ApplicationService{
  userService!: IUserService
  bookService!: IBookService
  requestService!: IRequestService
  bookCpService!: IBookCollectionService
    
  constructor(){
    this.initializeServices()
  }

  private initializeServices(){
    this.userService = new UserService()
    this.bookService = new BookService()
    this.requestService = new RequestService()
    this.bookCpService = new BookCollectionService()
  }
    
}