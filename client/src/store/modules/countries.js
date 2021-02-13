import { getCountries } from "@/api/countries";
import { callApi } from "../util";
import { COUNTRIES } from "../types";

const INITIAL_STATE = {
  data: null,
  error: null,
  failed: false,
  loaded: false,
  loading: false,
};

const state = () => INITIAL_STATE;

const getters = {
  all: (state) => state.data,
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
};

const actions = {
  // fetch: (store) => callApi(() => getCountries(), COUNTRIES)(store),
  [COUNTRIES.FETCH]: (store) =>
    callApi(store, { cb: () => getCountries(), types: COUNTRIES }),
};

const mutations = {
  [COUNTRIES.PENDING](state) {
    state.loading = true;
  },
  [COUNTRIES.SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [COUNTRIES.FAILURE](state, data) {
    state.data = null;
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
