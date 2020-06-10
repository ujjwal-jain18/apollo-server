import constants from '../../lib/constants';
import pubsub from '../pubsub';

export default {
    traineeAdded: {
        subscribe: () => pubsub.asyncIterator([constants.subscriptions.TRAINEE_ADDED]),
    },
    traineeUpdated: {
        subscribe: () => pubsub.asyncIterator([constants.subscriptions.TRAINEE_UPDATED]),
    },
    traineeDeleted: {
        subscribe: () => pubsub.asyncIterator([constants.subscriptions.TRAINEE_DELETED]),
    },
}