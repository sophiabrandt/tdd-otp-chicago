import 'dotenv/config';
import mongoose from 'mongoose';
import { SecretNotFoundInRepositoryError } from '../../domain/models/errors/SecretNotFoundInRepositoryError';
import { Secret } from '../../domain/models/Secret';
import { UrlId } from '../../domain/models/UrlId';
import { SecretRepository } from '../../domain/ports/out/SecretRepository';
import { SecretModel } from './SecretModel';

export class MongoSecretRepository implements SecretRepository {

    private static async setConnection() {
        if (mongoose.connection?.readyState === 0) {
            await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
            if (process.env.NODE_ENV !== 'test') {
                console.log('Connected to database');
            }
        }
    }

    constructor() {
        MongoSecretRepository.setConnection();
    }

    async getSecretByUrlId(urlId: UrlId): Promise<Secret> {
        const doc = await SecretModel.findOne({ urlId: urlId.toString() });
        if (!doc) {
            throw new SecretNotFoundInRepositoryError;
        }
        return new Secret(doc.secret);
    }

    async removeSecretByUrlId(urlId: UrlId): Promise<void> {
        await SecretModel.deleteOne({ urlId: urlId.toString() });
    }

    async storeUrlIdAndSecret(urlId: UrlId, secret: Secret): Promise<void> {
        await SecretModel.create({ urlId: urlId.toString(), secret: secret.toString() });
    }
}
