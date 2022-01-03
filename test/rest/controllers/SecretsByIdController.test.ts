import { NextFunction, request, response } from 'express';
import { SecretNotFoundInRepositoryError } from '../../../src/domain/models/errors/SecretNotFoundInRepositoryError';
import { Secret } from '../../../src/domain/models/Secret';
import { SecretRetriever } from '../../../src/domain/ports/in/SecretRetriever';
import { ValidationError } from '../../../src/domain/rest/errors/ValidationError';
import { SecretsByIdController } from '../../../src/rest/controllers/SecretsByIdControlller';

describe('SecretsByIdController Test', () => {
    it('should throw an error when sending an invalid URL', () => {
        expect.assertions(2);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        const res = expect.any(response);
        const secretRetriever: SecretRetriever = {
            retrieveSecret: jest.fn()
        };

        const secretsByIdController = new SecretsByIdController(secretRetriever);
        secretsByIdController.retrieveSecretByUrl(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(new ValidationError('URL is not valid'));
    });
    it('should throw an error when secret not found', async () => {
        expect.assertions(2);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        req.params = { urlId: 'a'.repeat(11) };
        const res = expect.any(response);

        const secretRetriever: SecretRetriever = {
            retrieveSecret: jest.fn().mockImplementation(async () => {
                throw new SecretNotFoundInRepositoryError();
            })
        };

        const secretsByIdController = new SecretsByIdController(secretRetriever);
        await secretsByIdController.retrieveSecretByUrl(req, res, next);

        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(new SecretNotFoundInRepositoryError());
    });
    it('should return a secret when it is found', async () => {
        expect.assertions(4);
        const next: NextFunction = jest.fn();
        const req = expect.any(request);
        req.params = { urlId: 'a'.repeat(11) };
        const res = expect.any(response);
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();

        const secretRetriever: SecretRetriever = {
            retrieveSecret: jest.fn().mockResolvedValue(new Secret('my secret'))
        };

        const secretsByIdController = new SecretsByIdController(secretRetriever);
        await secretsByIdController.retrieveSecretByUrl(req, res, next);

        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ secret: 'my secret' });
    });
});
