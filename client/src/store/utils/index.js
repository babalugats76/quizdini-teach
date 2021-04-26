/**
 * Wraps API calls in Vuex success/failure mutations
 *
 * Helps with more efficiently implementing common loading, success, failure
 *
 * Assumes use of endpoints that utilize the custom `get`, `post`, and `put`
 * functions that are part of the same utilities
 *
 * For use in custom Vuex modules, etc.
 *
 * @param {Object} store     Vuex store instance See: https://vuex.vuejs.org/api/#vuex-store
 * @param {Object} options   API callback (cb), vuex mutations types
 *
 * @see https://gist.github.com/lmiller1990/a4e9208a01707ff7c0e8447250fc6f13
 */
export const callApi = async (store, { cb, types }) => {
  try {
    store.commit(types.PENDING);
    const { data, error } = await cb();
    store.commit(error ? types.FAILURE : types.SUCCESS, data);
  } catch (err) {
    store.commit(types.FAILURE, err);
  }
};

// Curried version of the above (for posterity)
// const callApiVuex = (cb, types) => (store) => {
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
