import supertest from 'supertest';
import { SecretModel } from '../../src/adapters/repositories/SecretModel';
import server from '../../src/server';

const request = supertest(server.app);

describe('Get Secrets from OTP Secret API e2e Tests', () => {
    const urlId = '123456querty';
    const secret = '1234';
    beforeAll(async () => {
        await SecretModel.create({ urlId, secret });
    });

    it('should should retrieve a secret from the database', async () => {
        expect.assertions(2);
        const res = await request.get(`/api/v1.0/secrets/${urlId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ secret });
    });
    it('should throw an error when the same secret is retrieved twice', async () => {
        expect.assertions(2);
        const res = await request.get(`/api/v1.0/secrets/${urlId}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            title: 'SecretNotFoundInRepositoryError',
            message: 'Secret not found in the repository'
        });
    });
    it('should throw an error when the secret does not exist', async () => {
        expect.assertions(2);
        const res = await request.get('/api/v1.0/secrets/doesnotexist');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            title: 'SecretNotFoundInRepositoryError',
            message: 'Secret not found in the repository'
        });
    });
    it('should throw an error if the url is not valid', async () => {
        expect.assertions(2);
        const res = await request.get('/api/v1.0/secrets/ab');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            title: 'UrlIdTooShortError',
            message: 'UrlId is too short'
        });
    });
});
