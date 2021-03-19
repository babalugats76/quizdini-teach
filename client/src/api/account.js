import { get, post } from "@/utils/fetch";
const ENDPOINT = "/api/account";
const getAccount = () => get({ url: `${ENDPOINT}` });
const postAccount = (account) => post({ url: `${ENDPOINT}`, data: account });
export { getAccount, postAccount };
