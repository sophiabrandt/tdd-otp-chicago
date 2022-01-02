export class SecretNotFoundInRepositoryError extends Error {
    constructor() {
        super('Secret not found in the repository');
        this.name = 'SecretNotFoundInRepositoryError';
    }
}
