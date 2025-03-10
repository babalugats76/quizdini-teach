import { getAuth } from "@api";
import { AUTH } from "@vuex/types";
import { callApi } from "@vuex/utils";

// data for unauthorized user (initial and failed state)
const UNAUTHORIZED = {
  accountType: null, // no account type
  credits: null, // unknown credits
  googlePicture: null, // unknown Google attributes
  loggedIn: false, // not logged in
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
  accountType: (state) => state.accountType,
  auth: (state) => state.data,
  loggedIn: (state) => state.data.loggedIn,
  credits: (state) => state.data.credits,
  error: (state) => state.error,
  failed: (state) => state.failed,
  googlePicture: (state) => state.googlePicture,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
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
          loggedIn: true,
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
