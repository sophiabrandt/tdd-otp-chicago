import { SecretTooShortError } from '../../../src/domain/models/errors/SecretTooShortError';
import { Secret } from '../../../src/domain/models/Secret';

describe('Secret Test', function() {
    it('should create an instance of the Secret class', () => {
        expect(new Secret('1234ac')).toBeInstanceOf(Secret);
    });
    it('should throw an error if the secret has less than 3 chars', () => {
        expect(() => new Secret('12')).toThrow(SecretTooShortError);
    });
});
