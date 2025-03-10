import { get, post, put } from "@utils/fetch";

const ACCOUNT_ENDPOINT = "/api/account";
const COUNTRIES_ENDPOINT = "/api/countries";
const AUTH_ENDPOINT = "/api/current_user";
const LOGIN_ENDPOINT = "/auth/local";
const MATCHES_ENDPOINT = "/api/matches";
const PAYMENTS_ENDPOINT = "/api/payments";
const STATES_ENDPOINT = "/api/states";
const TOKEN_ENDPOINT = "/api/token";

const getAccount = () => get({ url: `${ACCOUNT_ENDPOINT}` });
const getAuth = () => get({ url: `${AUTH_ENDPOINT}` });
const getCountries = () => get({ url: `${COUNTRIES_ENDPOINT}` });
const getMatch = (matchId) => get({ url: `${MATCHES_ENDPOINT}/${matchId}` });
const getMatches = () => get({ url: `${MATCHES_ENDPOINT}` });
const getMatchStats = (matchId) => get({ url: `${MATCHES_ENDPOINT}/${matchId}/stats` });
const getPayments = () => get({ url: `${PAYMENTS_ENDPOINT}` });
const getStates = () => get({ url: `${STATES_ENDPOINT}` });

const postAccount = (account) => post({ url: `${ACCOUNT_ENDPOINT}`, data: account });
const postLogin = (auth) => post({ url: `${LOGIN_ENDPOINT}`, data: auth });
const postMatch = (match) => post({ url: `${MATCHES_ENDPOINT}`, data: match });
const postPayment = (credits) => post({ url: `${PAYMENTS_ENDPOINT}`, data: credits });

const resetPassword = (reset) => put({ url: `${ACCOUNT_ENDPOINT}/password-reset`, data: reset });
const sendRecoveryEmail = (recovery) => post({ url: `${ACCOUNT_ENDPOINT}/lost`, data: recovery });
const updateMatch = (match) => {
  const { matchId = null } = match;
  return put({ url: `${MATCHES_ENDPOINT}`, data: match, id: matchId });
};

const validateToken = (secret) => get({ url: `${TOKEN_ENDPOINT}/${secret}` });
const verifyAccount = (secret) => put({ url: `${ACCOUNT_ENDPOINT}/verify`, data: secret });

const callApi = (cb) => async (...args) => {
  const response = await cb(args);
  const { data = null, error = null } = response;
  return {
    data,
    error,
    failed: error ? true : false,
    loaded: error ? false : true,
  };
};

export {
  callApi,
  getAccount,
  getAuth,
  getCountries,
  getPayments,
  getMatch,
  getMatches,
  getMatchStats,
  getStates,
  postAccount,
  postLogin,
  postMatch,
  postPayment,
  resetPassword,
  sendRecoveryEmail,
  updateMatch,
  validateToken,
  verifyAccount,
};
