import { TOGGLE_LOADING } from "./types";

// const STATUS = {
//   INIT: 0,
//   LOADING: 1,
//   FAILURE: 2,
//   SUCCESS: 3,
// };

const state = {
  error: null,
  // failed: false,
  // loaded: false,
  loading: false,
};

const getters = {
  failed: (state) => !!state.error,
  loading: (state) => state.loading,
};

const mutations = {
  [TOGGLE_LOADING](state, loading) {
    state.loading = loading;
  },
};

/** @see https://gist.github.com/lmiller1990/a4e9208a01707ff7c0e8447250fc6f13 */
const callApi = async (store, { cb, types }) => {
  try {
    store.commit(types.PENDING);
    const { data, error } = await cb();
    store.commit(error ? types.FAILURE : types.SUCCESS, data);
  } catch (err) {
    store.commit(types.FAILURE, err);
  }
};

// const callApi = (cb, types) => (store) => {
//   store.commit(types.PENDING);
//   return cb()
//     .then((response) =>
//       store.commit(
//         response.error ? types.FAILURE : types.SUCCESS,
//         response.data
//       )
//     )
//     .catch((error) => store.commit(types.FAILURE, error));
// };

export {
  // STATUS,
  state as apiState,
  getters as apiGetters,
  mutations as apiMutations,
  // plugin as apiHelperPlugin,
  // isError,
  callApi,
};
