import { getAccount } from "@/api/account";
import { callApi } from "../util";
import { ACCOUNT } from "../types";

const INITIAL_STATE = {
  data: {},
  error: null,
  failed: false,
  loaded: false,
  loading: false,
};

const state = () => INITIAL_STATE;

const getters = {
  account: (state) => state.data,
  email: (state) => state.data.email,
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
};

const actions = {
  // fetch: (store) => callApi(() => getAccount(), ACCOUNT)(store),
  [ACCOUNT.FETCH]: (store) =>
    callApi(store, { cb: () => getAccount(), types: ACCOUNT }),
};

const mutations = {
  [ACCOUNT.PENDING](state) {
    state.loading = true;
  },
  [ACCOUNT.SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [ACCOUNT.FAILURE](state, data) {
    state.data = {};
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
