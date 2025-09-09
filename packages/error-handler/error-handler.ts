import { AppError } from "./index";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        console.log(`Error ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            success: false,
            status: "error",
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    console.log("Unhandled error:", err);

    return res.status(500).json({
        success: false,
        status: "error",
        message: "Something went wrong, please try again!",
    });
};

export default errorMiddleware;
