import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
const path = require('path');

import * as user from './users/index';

const typeArray = fileLoader(path.join(__dirname, './**/*.graphql'));

const typeDefs = mergeTypes(typeArray, { all: true });

export default {
  resolvers: {
    Query: {
      ...user.Query,
    },
  },
  typeDefs,
};
