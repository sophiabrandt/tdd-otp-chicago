import { Secret } from '../../../src/domain/models/Secret';
import { UrlId } from '../../../src/domain/models/UrlId';
import { SecretRepository } from '../../../src/domain/ports/out/SecretRepository';
import { OneTimeSecretRetriever } from '../../../src/domain/useCases/OneTimeSecretRetriever';

describe('OneTimeSecretRetriever Test', function() {
    it('should retrieve a secret one time', async () => {
        expect.assertions(5);

        const urlId = new UrlId('a'.repeat(11));
        const secretRepository: SecretRepository = {
            getSecretByUrlId: jest.fn().mockResolvedValue(new Secret('b'.repeat(4))),
            removeSecretByUrlId: jest.fn(),
            storeUrlIdAndSecret: jest.fn(),
        };

        const oneTimeSecretRetriever = new OneTimeSecretRetriever(secretRepository);

        expect(await oneTimeSecretRetriever.retrieveSecret(urlId)).toEqual(new Secret('b'.repeat(4)));
        expect(secretRepository.getSecretByUrlId).toBeCalledTimes(1);
        expect(secretRepository.getSecretByUrlId).toBeCalledWith(urlId);
        expect(secretRepository.removeSecretByUrlId).toBeCalledTimes(1);
        expect(secretRepository.removeSecretByUrlId).toBeCalledWith(urlId);
    });
});
