import { config } from 'dotenv';
config();
const configuration = Object.freeze({
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  serviceURL: process.env.SERVICE_URL,
});
export default configuration;
