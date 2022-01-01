import { Secret } from '../models/Secret';
import { UrlId } from '../models/UrlId';
import { SecretRetriever } from '../ports/in/SecretRetriever';
import { SecretRepository } from '../ports/out/SecretRepository';

export class OneTimeSecretRetriever implements SecretRetriever {
    constructor(private secretRepository: SecretRepository) {}

    async retrieveSecret(urlId: UrlId): Promise<Secret> {
        const secret = await this.secretRepository.getSecretByUrlId(urlId);
        await this.secretRepository.removeSecretByUrlId(urlId);
        return secret;
    }
}
