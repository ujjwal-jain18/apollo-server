import schema from './modules/index';
import configuration from './config/configuration';
import Server from './server';

const server = new Server(configuration);
server.bootstrap();
server.setupApolloServer(schema);
