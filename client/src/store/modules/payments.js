import { getPayments } from "@/api/payments";
import { callApi } from "../util";
import { PAYMENTS } from "../types";

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
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
};

const actions = {
  // fetch: (store) => callApi(() => getPayments(), PAYMENTS)(store),
  [PAYMENTS.FETCH]: (store) =>
    callApi(store, { cb: () => getPayments(), types: PAYMENTS }),
};

const mutations = {
  [PAYMENTS.PENDING](state) {
    state.loading = true;
  },
  [PAYMENTS.SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [PAYMENTS.FAILURE](state, data) {
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
