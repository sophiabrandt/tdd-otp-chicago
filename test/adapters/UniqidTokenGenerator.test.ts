import uniqid from 'uniqid';
import { UniqidTokenGenerator } from '../../src/adapters/UniqidTokenGenerator';

jest.mock('uniqid');
const mockUniqid = uniqid as jest.MockedFunction<typeof uniqid>;

describe('UniqidTokenGenerator Test', function() {
    it('should generate a token that is langer than 10 characters', async () => {
        expect.assertions(2);
        mockUniqid.mockReturnValue('x'.repeat(11));
        const uniqTokenGenerator = new UniqidTokenGenerator();

        const token = uniqTokenGenerator.generateToken();

        expect(token).toBe('x'.repeat(11));
        expect(token.length).toBeGreaterThanOrEqual(10);
    });
});
