import uniqid from 'uniqid';
import { TokenGenerator } from '../../domain/ports/out/TokenGenerator';

export class UniqidTokenGenerator implements TokenGenerator {
    generateToken(): string {
        return uniqid();
    }
}
