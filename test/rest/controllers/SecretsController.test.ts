import { NextFunction, request, response } from 'express';
import { UrlId } from '../../../src/domain/models/UrlId';
import { SecretStorer } from '../../../src/domain/ports/in/SecretStorer';
import { ValidationError } from '../../../src/domain/rest/errors/ValidationError';
import { SecretsController } from '../../../src/rest/controllers/SecretsController';

describe('SecretsController Test', () => {
    it('should throw a validation error if the body of the request is not provided', () => {
        expect.assertions(2);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        const res = expect.any(response);
        const secretStorer: SecretStorer = {
            storeSecret: jest.fn()
        };
        const secretsController = new SecretsController(secretStorer);
        secretsController.createSecret(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(new ValidationError('Request body is invalid'));
    });
    it('should throw a validation error if the body of the request has no secret', () => {
        expect.assertions(2);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        req.body = { secret: undefined };
        const res = expect.any(response);
        const secretStorer: SecretStorer = {
            storeSecret: jest.fn()
        };
        const secretsController = new SecretsController(secretStorer);
        secretsController.createSecret(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(new ValidationError('Request body is invalid'));
    });
    it('should throw a validation error if the secret is not a string', () => {
        expect.assertions(2);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        req.body = { secret: 1234 };
        const res = expect.any(response);
        const secretStorer: SecretStorer = {
            storeSecret: jest.fn()
        };
        const secretsController = new SecretsController(secretStorer);

        secretsController.createSecret(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(new ValidationError('Request body is invalid'));
    });
    it('should create a valid secret', async () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        req.body = { secret: 'my secret' };
        const res = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        const secretStorer: SecretStorer = {
            storeSecret: jest.fn().mockResolvedValue(new UrlId('some UrlId that was generated'))
        };
        const secretsController = new SecretsController(secretStorer);

        await secretsController.createSecret(req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ urlId: 'some UrlId that was generated' });
    });
});
