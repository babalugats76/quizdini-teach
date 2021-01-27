const state = () => ({
  counter: 0,
});

const getters = {
  counter: (state) => {
    return state.counter;
  },
};

const actions = {
  resetCounter({ commit }) {
    commit("setCounter", 0);
  },
  updateCounter({ commit }) {
    commit("incrementCounter");
  },
};

const mutations = {
  setCounter(state, val) {
    state.counter = val;
  },
  incrementCounter(state) {
    state.counter++;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
