import userInstance from '../../service/user';
import pubsub from '../pubsub';
import constants from '../../lib/constants';

export default {
  createTrainee: (parent, args, context) => {
    const { user } = args;
    const addedUser = userInstance.createUser(user);
    pubsub.publish(constants.subscriptions.TRAINEE_ADDED, { traineeAdded: addedUser});
    return addedUser;
  },
  updateTrainee: (parent, args, context) => {
    const { id, role } = args;
    const updatedUser = userInstance.updateUser(id, role);
    pubsub.publish(constants.subscriptions.TRAINEE_UPDATED, { traineeUpdated: updatedUser});
    return updatedUser;
  },
  deleteTrainee: (parent, args, context) => {
    const { id } = args;
    const deletedId = userInstance.deleteUser(id);
    pubsub.publish(constants.subscriptions.TRAINEE_DELETED, { traineeDeleted: deletedId});
    return deletedId;
  },
};
