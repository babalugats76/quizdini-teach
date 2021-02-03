const actions = {
  async init({ dispatch }) {
    await dispatch("auth/fetch");
  },
};

export default actions;
