import { Request, Response, NextFunction } from 'express';
import ENV from '../utils/env.util';
import ErrorResponse from '../utils/error.util';
import logger from '../utils/logger.util';

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let message: string = '';
    let errors: Array<any> = [];
    let error = { ...err };

    // Debug logging in test environment
    if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'development'
    ) {
        console.log('Error Handler - Error details:', {
            name: err?.name,
            message: err?.message,
            statusCode: err?.statusCode,
            errors: err?.errors,
            stack: err?.stack?.split('\n').slice(0, 3),
        });
    }

    // Handle ErrorResponse instances (from controllers)
    // Check for statusCode property (ErrorResponse has this)
    // ErrorResponse instances passed through next() have statusCode property
    if (err && typeof err.statusCode === 'number' && err.statusCode > 0) {
        return res.status(err.statusCode).json({
            error: true,
            errors: Array.isArray(err.errors) ? err.errors : [],
            data: err.data || {},
            message: err.message || 'Server Error',
            status: err.statusCode,
        });
    }

    // Handle Mongoose validation errors
    if (err.errors) {
        errors = Object.values(err.errors).map((item: any) => {
            let result: any;
            if (item.properties) {
                result = item.properties.message;
            } else {
                result = item;
            }
            return result;
        });

        if (ENV.isDevelopment() || ENV.isStaging()) {
            logger.log({ data: err, label: 'ERR' });
        }

        if (err.name === 'CastError') {
            message = 'Resource not found - id cannot be casted';
            error = new ErrorResponse(message, 500, errors);
        }

        if (err.code === 11000) {
            message = 'Duplicate field value entered';
            error = new ErrorResponse(message, 500, errors);
        }

        if (err.name === 'Validation Error') {
            message = 'An errror occured';
            error = new ErrorResponse(message, 500, errors);
        }
    }

    // Handle other errors
    res.status(error.statusCode || 500).json({
        error: true,
        errors: error.errors ? error.errors : [],
        data: {},
        message: error.message ? error.message : 'Server Error',
        status: error.statusCode ? error.statusCode : 500,
    });
};

export default errorHandler;
