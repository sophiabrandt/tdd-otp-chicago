import express from 'express';
import { errorHandler } from '../../adapters/rest/middlewares/ErrorHandler';
import { Route } from './routes/Route';

export class Application {
    app: express.Application = express();

    constructor(private routes: Route[]) {
        this.appConfig();
        this.routeConfig();
    }

    startServerOnPort(port: number): void {
        if (process.env.NODE_ENV !== 'test') {
            this.app.listen(port, () => {
                console.info(`Listening on port ${port}`);
            });
        }
    }

    private routeConfig(): void {
        this.routes.forEach(route => route.mountRoute(this.app));
        this.app.use(errorHandler);
    }

    private appConfig(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
}
