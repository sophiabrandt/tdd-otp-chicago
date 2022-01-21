import { UniqidTokenGenerator } from './adapters/externalServices/UniqidTokenGenerator';
import { MongoSecretRepository } from './adapters/repositories/MongoSecretRepository';
import { SecretsByIdController } from './adapters/rest/controllers/SecretsByIdControlller';
import { SecretsController } from './adapters/rest/controllers/SecretsController';
import { Application } from './domain/rest/Application';
import { Route } from './domain/rest/routes/Route';
import { SecretsByIdRoute } from './domain/rest/routes/SecretsByIdRoute';
import { SecretsRoute } from './domain/rest/routes/SecretsRoute';
import { OneTimeSecretRetriever } from './domain/useCases/OneTimeSecretRetriever';
import { OneTimeSecretStorer } from './domain/useCases/OneTimeSecretStorer';

const secretRepository = new MongoSecretRepository();
const tokenGenerator = new UniqidTokenGenerator();
const secretStorer = new OneTimeSecretStorer(secretRepository, tokenGenerator);

const secretsController = new SecretsController(secretStorer);
const secretsRoute = new SecretsRoute(secretsController);

const secretRetriever = new OneTimeSecretRetriever(secretRepository);
const secretsByIdController = new SecretsByIdController(secretRetriever);
const secretByIdRoute = new SecretsByIdRoute(secretsByIdController);

const routes: Route[] = [];
routes.push(secretsRoute);
routes.push(secretByIdRoute);

const application: Application = new Application(routes);
application.startServerOnPort(parseInt(process.argv[2]) || 3000);

export default application;
