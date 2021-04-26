import { getStates } from "@api";
import { STATES } from "@vuex/types";
import { callApi } from "@vuex/utils";

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
  options: (state) =>
    state.data.reduce((acc, state) => {
      acc.push({
        key: state.stateId,
        value: state.stateCode,
        text: state.stateName,
      });
      return acc;
    }, []),
  error: (state) => state.error,
  failed: (state) => state.failed,
  loaded: (state) => state.loaded,
  loading: (state) => state.loading,
};

const actions = {
  // fetch: (store) => callApi(() => getStates(), STATES)(store),
  [STATES.FETCH]: (store) => callApi(store, { cb: () => getStates(), types: STATES }),
};

const mutations = {
  [STATES.PENDING](state) {
    state.loading = true;
  },
  [STATES.SUCCESS](state, data) {
    state.data = data;
    state.error = null;
    state.failed = false;
    state.loaded = true;
    state.loading = false;
  },
  [STATES.FAILURE](state, data) {
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
