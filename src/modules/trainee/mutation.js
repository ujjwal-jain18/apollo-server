import pubsub from '../pubsub';
import constants from '../../lib/constants';

export default {
  createTrainee: async (parent, args, context) => {
    const {
      payload: { name, email, password },
    } = args;
    const {
      dataSources: { traineeAPI },
    } = context;
    const response = await traineeAPI.createTrainee({ name, email, password });
    pubsub.publish(constants.subscriptions.TRAINEE_ADDED, {
      traineeAdded: response.data,
    });
    return response.data;
  },

  updateTrainee: async (parent, args, context) => {
    const {
      payload: { id, name, email },
    } = args;
    const {
      dataSources: { traineeAPI },
    } = context;
    const response = await traineeAPI.updateTrainee({
      id,
      name,
      email,
    });
    pubsub.publish(constants.subscriptions.TRAINEE_UPDATED, {
      traineeUpdated: { id, name, email },
    });
    return response.data;
  },

  deleteTrainee: async (parent, args, context) => {
    const { id } = args;
    const {
      dataSources: { traineeAPI },
    } = context;
    const response = await traineeAPI.deleteTrainee(id);
    pubsub.publish(constants.subscriptions.TRAINEE_DELETED, {
      traineeDeleted: response.data.id,
    });
    return response.data.id;
  },
};
