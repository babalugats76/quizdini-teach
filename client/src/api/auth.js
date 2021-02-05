import { get, post } from "@/utils/fetch";
const AUTH_ENDPOINT = "/api/current_user";
const LOGIN_ENDPOINT = "/auth/local";
const getAuth = () => get({ url: `${AUTH_ENDPOINT}` });
const postLogin = (auth) => post({ url: `${LOGIN_ENDPOINT}`, data: auth });
export { getAuth, postLogin };
