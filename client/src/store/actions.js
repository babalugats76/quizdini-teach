const actions = {
  async init({ dispatch }) {
    await dispatch("auth/AUTH_FETCH");
  },
};

export default actions;
