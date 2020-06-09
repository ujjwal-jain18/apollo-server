import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
const graphqlHTTP = require('express-graphql');

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
    this.app.listen(this.config.port, (err) => {
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
      app.use(
        '/graphql',
        graphqlHTTP({
          schema,
          graphiql: true,
        })
      );
    });
  };

  async setupApolloServer(schema) {
    const { app } = this;
    this.server = new ApolloServer({ ...schema });
    this.server.applyMiddleware({ app });
  }
}

export default Server;
