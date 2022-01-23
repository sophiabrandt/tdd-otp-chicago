import supertest from 'supertest';
import { SecretModel } from '../../src/adapters/repositories/SecretModel';
import { Secret } from '../../src/domain/models/Secret';
import server from '../../src/server';

const request = supertest(server.app);

describe('Store Secret in OTP Secret API e2e Tests', () => {
    afterAll(async () => {
        await SecretModel.deleteMany();
    });

    it('should should store a secret in the database', async () => {
        expect.assertions(2);
        const secret = new Secret('a'.repeat(4));

        const res = await request.post(`/api/v1.0/secrets`)
            .send(secret);

        expect(res.status).toBe(201);
        expect(res.body.urlId.length).toBeGreaterThanOrEqual(10);
    });
    it('should have created a secret in the database', async () => {
        expect.assertions(3);
        const doc = await SecretModel.findOne({ secret: 'a'.repeat(4) });

        expect(doc.secret).toBe('aaaa');
        expect(doc.urlId.length).toBeGreaterThanOrEqual(10);
        expect(typeof doc.urlId).toBe('string');
    });
    it('should send an error when the secret is too short', async () => {
        expect.assertions(2);
        const res = await request.post(`/api/v1.0/secrets`)
            .send({ secret: '12' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            title: 'SecretTooShortError',
            message: 'Secret is too short'
        });
    });
    it('should send an error when the request body is invalid', async () => {
        expect.assertions(2);
        const res = await request.post(`/api/v1.0/secrets`)
            .send({ whatever: '123' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            title: 'ValidationError',
            message: 'Request body is invalid'
        });
    });
    it('should send an error when the request body type is invalid', async () => {
        expect.assertions(2);
        const res = await request.post(`/api/v1.0/secrets`)
            .send({ secret: 1234 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            title: 'ValidationError',
            message: 'Request body is invalid'
        });
    });
});
