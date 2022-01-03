import { NextFunction, Request, Response } from 'express';
import { UrlId } from '../../domain/models/UrlId';
import { SecretRetriever } from '../../domain/ports/in/SecretRetriever';
import { ValidationError } from '../../domain/rest/errors/ValidationError';

export class SecretsByIdController {
    private static validateRequest(req: Request): void {
        if (!req.params?.urlId) {
            throw new ValidationError('URL is not valid');
        }
    }

    constructor(private secretRetriever: SecretRetriever) {
    }

    async retrieveSecretByUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            SecretsByIdController.validateRequest(req);
            const urlId = new UrlId(req.params.urlId);
            const secret = await this.secretRetriever.retrieveSecret(urlId);
            res.status(200).json(secret);
        } catch (e) {
            next(e);
        }
    };
}
