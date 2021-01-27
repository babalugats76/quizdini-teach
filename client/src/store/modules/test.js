const state = () => ({
  counter: 0,
});

const getters = {
  counter: (state) => {
    return state.counter;
  },
};

/***
 * can contain asynchronous task
 * often commit mutations (synchronous)
 * first arg is context object
 * use `dispatch` to call an action; use `commit` to call mutation
 */
const actions = {
  setCounter({ commit }, payload) {
    commit("setCounter", payload);
  },
  resetCounter({ commit }) {
    commit("setCounter", { counter: 0 });
  },
  updateCounter({ commit }) {
    commit("incrementCounter");
  },
};

/***
 * mutations must be synchronous
 * used directly or commited as part of an action
 */
const mutations = {
  setCounter(state, payload) {
    state.counter = payload.counter;
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
