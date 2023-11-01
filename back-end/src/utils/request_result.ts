enum HttpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface RequestResult<T> {
    readonly httpCode: HttpCode;
    readonly message?: string;
    readonly data?: T;
    readonly description: string;
}

class SuccessResult<T> implements RequestResult<T> {
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

class ErrorResult<T> extends Error implements RequestResult<T>{
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

        this.message = message
        this.httpCode = httpCode;
        this.description = description;
    }

}

export { HttpCode, SuccessResult, ErrorResult, RequestResult }