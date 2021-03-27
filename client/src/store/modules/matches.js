import { getMatches } from "@/api/matches";
import { callApi } from "../util";
import { MATCHES } from "../types";

const INITIAL_STATE = {
  data: [],
  error: null,
  failed: false,
  loaded: false,
  loading: false,
};

const state = () => INITIAL_STATE;

const getters = {
  all: (state) => state.data,
  count: (state) => state.data.length,
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
};

const actions = {
  // fetch: (store) => callApi(() => getMatches(), MATCHES)(store),
  [MATCHES.FETCH]: (store) => callApi(store, { cb: () => getMatches(), types: MATCHES }),
};

const mutations = {
  [MATCHES.PENDING](state) {
    state.loading = true;
  },
  [MATCHES.SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [MATCHES.FAILURE](state, data) {
    state.data = [];
    state.error = data;
    state.failed = true;
    state.loaded = false;
    state.loading = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
