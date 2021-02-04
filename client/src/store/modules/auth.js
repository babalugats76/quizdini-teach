import { getAuth } from "@/api/auth";
import { apiState, apiGetters, apiMutations } from "../apiHelper";

// data for unauthorized user
const UNAUTHORIZED = {
  accountType: null, // no account type
  credits: null, // unknown credits
  googlePicture: null, // unknown Google attributes
  error: null, // no errors
  loggedIn: false, // not logged in
  username: null, // unknown username
};

const { error, status } = apiState;

const state = () => ({ data: UNAUTHORIZED, error, status });

const getters = {
  auth: (state) => state.data,
  loggedIn: (state) => state.data.loggedIn,
  ...apiGetters,
};

const actions = {
  async fetch({ commit }) {
    commit("load");
    commit("process", await getAuth());
  },
};

const mutations = {
  ...apiMutations,
  success(state, { data }) {
    const { googleId, id = null } = data || {};

    /***
     * Determine "auth" object
     * Presence of `id` signifies that user is logged; otherwise, unauthorized
     * Presence of `googleId` signifies Google OAuth account; otherwise, local
     */
    const auth = id
      ? {
          ...data,
          accountType: googleId ? "google" : "local",
          loggedIn: true,
        }
      : UNAUTHORIZED;

    state.data = auth;
    state.error = null;
  },
  failure(state, { error }) {
    state.error = error;
    state.data = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
