import userInterface from '../../service/user'; 

export default {
    getAllTrainees: () => {
        return userInterface.getAllUsers();
    },

    getTrainee: (parent, args, context) => {
        const { id } = args;
        return userInterface.getUser(id);
    }

};