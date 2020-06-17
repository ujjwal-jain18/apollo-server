export default {
  getTrainee: async (parent, args, context) => {
    const {
      options: { skip, limit },
    } = args;
    const {
      dataSources: { traineeAPI },
    } = context;
    const response = await traineeAPI.getTrainee({ skip, limit });
    return response.data;

  },
};
