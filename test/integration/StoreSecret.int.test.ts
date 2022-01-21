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

describe('Store Secret in OTP Secret API Integration Tests', () => {
    it('should should store a secret in the database', async () => {
        expect.assertions(4);
        mongoose.connection.readyState = 1;
        const secret = new Secret('a'.repeat(4));
        SecretModel.create = jest.fn();

        const res = await request.post(`/api/v1.0/secrets`)
            .send(secret);

        expect(res.status).toBe(201);
        expect(res.body.urlId.length).toBeGreaterThanOrEqual(10);
        expect(SecretModel.create).toHaveBeenCalledTimes(1);
        expect(SecretModel.create).toHaveBeenCalledWith(
            {
                secret: secret.toString(),
                urlId: new UrlId(res.body.urlId).toString(),
            });
    });
    it('should should return an error if the secret is smaller than 3 characters', async () => {
        expect.assertions(3);
        mongoose.connection.readyState = 1;
        SecretModel.create = jest.fn();

        const res = await request.post(`/api/v1.0/secrets`)
            .send({ secret: '11' });

        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
            title: 'SecretTooShortError',
            message: 'Secret is too short'
        });
        expect(SecretModel.create).toHaveBeenCalledTimes(0);
    });
});
