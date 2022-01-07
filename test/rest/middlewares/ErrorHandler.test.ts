import { NextFunction, request, Request, response, Response } from 'express';
import { Error } from 'mongoose';
import { SecretNotFoundInRepositoryError } from '../../../src/domain/models/errors/SecretNotFoundInRepositoryError';
import { SecretTooShortError } from '../../../src/domain/models/errors/SecretTooShortError';
import { UrlIdTooShortError } from '../../../src/domain/models/errors/UrlIdTooShortError';
import { ValidationError } from '../../../src/domain/rest/errors/ValidationError';
import { errorHandler } from '../../../src/rest/middlewares/ErrorHandler';

describe('ErrorHandler Test', () => {
    it('should send an uncontrolled error', () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req: Request = expect.any(request);
        const res: Response = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const error = new Error('Server on fire');

        errorHandler(error, req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(500);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ title: 'InternalServerError', message: 'Something went wrong' });
    });
    it('should send a controlled error', () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req: Request = expect.any(request);
        const res: Response = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const error = new ValidationError('body is not valid');

        errorHandler(error, req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ title: 'ValidationError', message: 'body is not valid' });
    });
    it('should send an UrlID too short error', () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req: Request = expect.any(request);
        const res: Response = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const error = new UrlIdTooShortError();

        errorHandler(error, req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ title: 'UrlIdTooShortError', message: 'UrlId is too short' });
    });
    it('should send a Secret too short error', () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req: Request = expect.any(request);
        const res: Response = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const error = new SecretTooShortError();

        errorHandler(error, req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ title: 'SecretTooShortError', message: 'Secret is too short' });
    });
    it('should send a Secret not found error', () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req: Request = expect.any(request);
        const res: Response = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const error = new SecretNotFoundInRepositoryError();

        errorHandler(error, req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ title: 'SecretNotFoundInRepositoryError', message: 'Secret not found in the repository' });
    });
});
