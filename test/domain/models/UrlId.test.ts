import { UrlIdTooShortError } from '../../../src/domain/models/errors/UrlIdTooShortError';
import { UrlId } from '../../../src/domain/models/UrlId';

describe('UrlId Test', function() {
    it('should create an instance of the UrlId class', () => {
        expect(new UrlId('a'.repeat(11))).toBeInstanceOf(UrlId);
    });
    it('should throw an error if the UrlId has less than 10 characters', () => {
        expect(() => new UrlId('a'.repeat(10))).toThrow(UrlIdTooShortError);
    });
});
