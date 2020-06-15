import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { UserAPI, TraineeAPI } from './dataSource/index';

class Server {
  constructor(config) {
    this.app = express();
    this.config = config;
  }

  bootstrap = () => {
    this.initBodyParser();
    this.setupRoutes();
    return this;
  };

  run = () => {
    const {
      config: { port },
    } = this;
    this.httpServer.listen(this.config.port, (err) => {
      if (err) {
        console.log('error');
        throw err;
      }
      console.log(`App is running successfully on port ${port}`);
    });
  };

  initBodyParser = () => {
    const { app } = this;
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());
  };

  setupRoutes = () => {
    const { app } = this;
    app.use('/health-check', (res) => {
      console.log(' Inside health check ');
      res.send(' I am OK ');
    });
  };

  async setupApolloServer(schema) {
    const { app } = this;
    this.server = new ApolloServer({
      ...schema,
      dataSources: () => {
        return {
          userAPI: new UserAPI(),
          traineeAPI: new TraineeAPI(),
        };
      },
      context: ({ req }) => {
        if (req) {
          return { token: req.headers.authorization };
        }
        return {};
      },
    });
    this.server.applyMiddleware({ app });
    this.httpServer = createServer(app);
    this.server.installSubscriptionHandlers(this.httpServer);
    this.run();
  }
}

export default Server;
