import { get, post } from "@/utils/fetch";
const ACCOUNT_ENDPOINT = "/api/account";
const getAccount = () => get({ url: `${ACCOUNT_ENDPOINT}` });
const postAccount = (account) =>
  post({ url: `${ACCOUNT_ENDPOINT}`, data: account });
export { getAccount, postAccount };
