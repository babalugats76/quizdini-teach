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
