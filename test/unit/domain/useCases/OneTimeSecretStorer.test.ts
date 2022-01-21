import { Secret } from '../../../../src/domain/models/Secret';
import { UrlId } from '../../../../src/domain/models/UrlId';
import { SecretRepository } from '../../../../src/domain/ports/out/SecretRepository';
import { TokenGenerator } from '../../../../src/domain/ports/out/TokenGenerator';
import { OneTimeSecretStorer } from '../../../../src/domain/useCases/OneTimeSecretStorer';

describe('OneTimeSecretStorer Test', function() {
    it('should store the secret and return an UrlId', async () => {
        expect.assertions(4);

        const secret = new Secret('d'.repeat(4));
        const urlId = new UrlId('f'.repeat(11));
        const tokenGenerator: TokenGenerator = {
            generateToken: jest.fn().mockReturnValue('f'.repeat(11))
        };
        const secretRepository: SecretRepository = {
            getSecretByUrlId: jest.fn(),
            removeSecretByUrlId: jest.fn(),
            storeUrlIdAndSecret: jest.fn(),
        };

        const oneTimeSecretStorer = new OneTimeSecretStorer(secretRepository, tokenGenerator);

        expect(await oneTimeSecretStorer.storeSecret(secret)).toEqual(urlId);
        expect(secretRepository.storeUrlIdAndSecret).toBeCalledTimes(1);
        expect(secretRepository.storeUrlIdAndSecret).toBeCalledWith(urlId, secret);
        expect(tokenGenerator.generateToken).toBeCalledTimes(1);
    });
});
