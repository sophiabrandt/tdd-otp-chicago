import { SecretTooShortError } from '../../../src/domain/models/errors/SecretTooShortError';
import { Secret } from '../../../src/domain/models/Secret';

describe('Secret Test', function() {
    it('should create an instance of the Secret class', () => {
        expect(new Secret('1234ac')).toBeInstanceOf(Secret);
    });
    it('should throw an error if the secret has less than 3 chars', () => {
        expect(() => new Secret('ab')).toThrow(SecretTooShortError);
    });
    it('should return a string representation on the toString method', () => {
        expect(new Secret('abcde').toString()).toBe('abcde');
    });
});
