import { NextFunction, Request, Response } from 'express';
import { SecretNotFoundInRepositoryError } from '../../../domain/models/errors/SecretNotFoundInRepositoryError';
import { SecretTooShortError } from '../../../domain/models/errors/SecretTooShortError';
import { UrlIdTooShortError } from '../../../domain/models/errors/UrlIdTooShortError';
import { ValidationError } from '../../../domain/rest/errors/ValidationError';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ValidationError ||
        error instanceof UrlIdTooShortError ||
        error instanceof SecretTooShortError
    ) {
        res.status(400).json({
            title: error.name,
            message: error.message,
        });
    } else if (error instanceof SecretNotFoundInRepositoryError) {
        res.status(404).json({
            title: error.name,
            message: error.message,
        });
    } else {
        res.status(500).json({
            title: 'InternalServerError',
            message: 'Something went wrong'
        });
    }
};
