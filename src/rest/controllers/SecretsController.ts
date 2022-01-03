import { NextFunction, Request, Response } from 'express';
import { Secret } from '../../domain/models/Secret';
import { SecretStorer } from '../../domain/ports/in/SecretStorer';
import { ValidationError } from '../../domain/rest/errors/ValidationError';

export class SecretsController {
    private static validateRequest(req: Request): void {
        if (!req.body || !req.body?.secret || typeof req.body?.secret != 'string') {
            throw new ValidationError('Request body is invalid');
        }
    }

    constructor(private secretStorer: SecretStorer) {}

    async createSecret(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            SecretsController.validateRequest(req);
            const urlId = await this.secretStorer.storeSecret(new Secret(req.body.secret));
            res.status(201).json(urlId);
        } catch (e) {
            next(e);
        }
    }
}
