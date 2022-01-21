import mongoose from 'mongoose';
import supertest from 'supertest';
import { SecretModel } from '../../src/adapters/repositories/SecretModel';
import { Secret } from '../../src/domain/models/Secret';
import { UrlId } from '../../src/domain/models/UrlId';
import server from '../../src/server';

const request = supertest(server.app);

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {},
    Schema: class Schema {
    },
}));

jest.mock('../../src/adapters/repositories/SecretModel', () => ({
        SecretModel: class SecretModel {
        }
    }
));

describe('Get Secrets from OTP Secret API Integration Tests', () => {
    it('should should retrieve a secret from the database', async () => {
        expect.assertions(6);
        mongoose.connection.readyState = 1;
        const secret = new Secret('a'.repeat(4));
        const urlId = new UrlId('b'.repeat(11));
        SecretModel.findOne = jest.fn().mockResolvedValue(secret);
        SecretModel.deleteOne = jest.fn();

        const res = await request.get(`/api/v1.0/secrets/${urlId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(secret);
        expect(SecretModel.findOne).toHaveBeenCalledTimes(1);
        expect(SecretModel.findOne).toHaveBeenCalledWith(urlId);
        expect(SecretModel.deleteOne).toHaveBeenCalledTimes(1);
        expect(SecretModel.deleteOne).toHaveBeenCalledWith(urlId);
    });
    it('should should return an error if the secret does not exist in the database', async () => {
        expect.assertions(5);
        mongoose.connection.readyState = 1;
        const urlId = new UrlId('b'.repeat(11));
        SecretModel.findOne = jest.fn().mockResolvedValue(null);
        SecretModel.deleteOne = jest.fn();

        const res = await request.get(`/api/v1.0/secrets/${urlId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            title: 'SecretNotFoundInRepositoryError',
            message: 'Secret not found in the repository'
        });
        expect(SecretModel.findOne).toHaveBeenCalledTimes(1);
        expect(SecretModel.findOne).toHaveBeenCalledWith(urlId);
        expect(SecretModel.deleteOne).toHaveBeenCalledTimes(0);
    });
});
