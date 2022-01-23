import * as mongoose from 'mongoose';
import { MongoSecretRepository } from '../../../../src/adapters/repositories/MongoSecretRepository';
import { SecretModel } from '../../../../src/adapters/repositories/SecretModel';
import { SecretNotFoundInRepositoryError } from '../../../../src/domain/models/errors/SecretNotFoundInRepositoryError';
import { Secret } from '../../../../src/domain/models/Secret';
import { UrlId } from '../../../../src/domain/models/UrlId';

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {},
    Schema: class Schema {
    },
}));

jest.mock('../../../../src/adapters/repositories/SecretModel', () => ({
        SecretModel: class SecretModel {
        }
    }
));

describe('MongoSecretRepository Test', function() {
    it('should connect to the database', async () => {
        expect.assertions(2);
        jest.spyOn(global.console, 'log').mockImplementation(() => {});
        mongoose.connection.readyState = 0;
        new MongoSecretRepository();

        expect(mongoose.connect).toBeCalledTimes(1);
        expect(mongoose.connect).toBeCalledWith('mongodb://localhost:27017/test_onetimesecret');
    });
    it('should not connect to the database if the connection is already established', () => {
        expect.assertions(1);
        jest.spyOn(global.console, 'log').mockImplementation(() => {});
        mongoose.connection.readyState = 1;

        new MongoSecretRepository();

        expect(mongoose.connect).toBeCalledTimes(0);
    });
    it('should retrieve a secret from mongo', async () => {
        expect.assertions(3);
        const urlId = new UrlId('a'.repeat(11));
        const secretString = 'b'.repeat(4);
        mongoose.connection.readyState = 1;
        SecretModel.findOne = jest.fn().mockResolvedValue({ secret: secretString });

        const mongoSecretRepository = new MongoSecretRepository();

        expect(await mongoSecretRepository.getSecretByUrlId(urlId)).toEqual(new Secret(secretString));
        expect(SecretModel.findOne).toBeCalledTimes(1);
        expect(SecretModel.findOne).toBeCalledWith({ urlId: urlId.toString() });
    });
    it('should throw an error when queried secret does not exist', async () => {
        expect.assertions(3);
        const urlId = new UrlId('a'.repeat(11));
        mongoose.connection.readyState = 1;
        SecretModel.findOne = jest.fn().mockResolvedValue(null);

        const mongoSecretRepository = new MongoSecretRepository();

        await expect(mongoSecretRepository.getSecretByUrlId(urlId)).rejects.toThrow(SecretNotFoundInRepositoryError);
        expect(SecretModel.findOne).toBeCalledTimes(1);
        expect(SecretModel.findOne).toBeCalledWith({ urlId: urlId.toString() });
    });
    it('should remove a secret from the repository', async () => {
        expect.assertions(2);
        const urlId = new UrlId('a'.repeat(11));
        mongoose.connection.readyState = 1;
        SecretModel.deleteOne = jest.fn();

        const mongoSecretRepository = new MongoSecretRepository();
        await mongoSecretRepository.removeSecretByUrlId(urlId);

        expect(SecretModel.deleteOne).toBeCalledTimes(1);
        expect(SecretModel.deleteOne).toBeCalledWith({ urlId: urlId.toString() });
    });
    it('should create an urlId Secret in the database ', async () => {
        expect.assertions(2);
        const urlId = new UrlId('a'.repeat(11));
        const secret = new Secret('b'.repeat(4));
        mongoose.connection.readyState = 1;
        SecretModel.create = jest.fn();

        const mongoSecretRepository = new MongoSecretRepository();
        await mongoSecretRepository.storeUrlIdAndSecret(urlId, secret);

        expect(SecretModel.create).toBeCalledTimes(1);
        expect(SecretModel.create).toBeCalledWith({ urlId: urlId.toString(), secret: secret.toString() });
    });
});
