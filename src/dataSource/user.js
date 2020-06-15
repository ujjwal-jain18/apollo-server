import { RESTDataSource } from 'apollo-datasource-rest';
import config from '../config/configuration';

export class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${config.serviceURL}/user`;
  }
  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token);
  }
  getMe() {
    return this.get('/me');
  }

  loginUser(payload) {
    return this.post('/login', payload);
  }
}
