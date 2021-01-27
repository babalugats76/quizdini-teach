import { fetchCountries } from "@/api/country";

const state = () => ({
  data: null, // payload from successful api call
  loaded: false, // whether initialized, successful or not
  loading: false, // whether api call is in progress
  error: null, // payload from unsuccessful api call
});

const actions = {
  async getCountries({ commit }) {
    commit("loading", true);
    commit("processData", await fetchCountries());
    commit("loading", false);
  },
};

const mutations = {
  loading(state, payload) {
    console.log("loading!");
    state.loading = payload;
  },
  processData(state, payload) {
    console.log("process data here...");
    console.log(JSON.stringify(payload, null, 4));
  },
};

export default {
  namespaced: true,
  state,
  //getters,
  actions,
  mutations,
};
