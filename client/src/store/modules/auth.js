import { getAuth } from "@/api/auth";
import { callApi } from "../util";
import { AUTH } from "../types";

// data for unauthorized user (initial and failed state)
const UNAUTHORIZED = {
  accountType: null, // no account type
  credits: null, // unknown credits
  googlePicture: null, // unknown Google attributes
  authenticated: false, // not logged in
  username: null, // unknown username
};

const INITIAL_STATE = {
  data: UNAUTHORIZED,
  error: null,
  failed: false,
  loaded: false,
  loading: false,
};

const state = () => INITIAL_STATE;

const getters = {
  auth: (state) => state.data,
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
  authenticated: (state) => state.data.authenticated,
  credits: (state) => state.data.credits,
};

const actions = {
  // fetch: (store) => callApi(() => getAuth(), AUTH)(store),
  [AUTH.FETCH]: (store) => callApi(store, { cb: () => getAuth(), types: AUTH }),
};

const mutations = {
  [AUTH.PENDING](state) {
    state.loading = true;
  },
  [AUTH.SUCCESS](state, data) {
    const { googleId, id = null } = data || {};
    const auth = id
      ? {
          ...data,
          accountType: googleId ? "google" : "local",
          authenticated: true,
        }
      : UNAUTHORIZED;

    state.data = auth;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [AUTH.FAILURE](state, data) {
    state.data = UNAUTHORIZED;
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
