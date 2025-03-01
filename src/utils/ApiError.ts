class ApiError extends Error{
    statusCode: number;
    message: string;
    operational: boolean;
    constructor(statusCode:number, message: string){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.operational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;