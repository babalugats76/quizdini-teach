import axios from "axios";

/* Include custom header containing client's current tz */
axios.defaults.headers.common[
  "quizdini-timezone"
] = Intl.DateTimeFormat().resolvedOptions().timeZone;

/* Set "global" settings that can be overwritten (by arg) */
const AXIOS_CONFIG = { timeout: 30000 };

/***
 * Calls GET method of url using axios
 *
 * @param {string} url     server URL used in request
 * @param {object} config  options used in request
 * @returns {object}       data or error object (from server)
 */
export const get = async ({ url, config = AXIOS_CONFIG }) => {
  try {
    const res = await axios.get(url, config);
    return { data: res.data, error: false };
  } catch (err) {
    return { data: err.response.data, error: true };
  }
};

/***
 * Calls PUT method of url using axios
 * @param {string} url     server URL used in request
 * @param {object} data    body of the request
 * @param {string} id      (Optional) id (of item) to append to resource url
 * @param {object} config  options used in request
 * @returns {object}       data or error object (from server)
 */
export const put = async ({ url, data, id = null, config = AXIOS_CONFIG }) => {
  try {
    const path = url + (id ? `/${id}` : "");
    const res = await axios.put(path, data, config);
    return { data: res.data, error: false };
  } catch (err) {
    return {
      data: err.response.data,
      error: true,
    };
  }
};

/***
 * Calls POST method of url using axios
 *
 * @param {string} url     server URL used in request
 * @param {object} data    body of the request
 * @param {object} config  options used in request
 * @returns {object}       data or error object (from server)
 */
export const post = async ({ url, data, config = AXIOS_CONFIG }) => {
  try {
    const res = await axios.post(url, data, config);
    return { data: res.data, error: false };
  } catch (err) {
    return { data: err.response.data, error: true };
  }
};

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
