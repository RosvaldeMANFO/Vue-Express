export enum HttpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export class RequestSuccess<T>{
  httpCode: HttpCode;
  data?: T;
  description: string;
  constructor(httpCode: HttpCode, data:T, description: string){

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode;
    this.data = data;
    this.description = description
  }
}

export class RequestFailure extends Error{
  httpCode: HttpCode;
  message: string;
  description: string;

  constructor(
    httpCode: HttpCode,
    message: string,
    description: string
  ){
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode
    this.message = message
    this.description = description
    Error.captureStackTrace(this, this.constructor);
  }

}