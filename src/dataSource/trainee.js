import { RESTDataSource } from 'apollo-datasource-rest';
import config from '../config/configuration';

export class TraineeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${config.serviceURL}/trainee`;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token);
  }

  async getTrainee(options) {
    return this.get('/', options);
  }

  async createTrainee(payload) {
    return this.post('/', payload);
  }

  async updateTrainee(payload) {
    return this.put('/', payload);
  }

  async deleteTrainee(id) {
    return this.delete(`/${id}`);
  }
}
