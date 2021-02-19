import { post } from "@/utils/fetch";
const ACCOUNT_ENDPOINT = "/api/account";
const postAccount = (account) =>
  post({ url: `${ACCOUNT_ENDPOINT}`, data: account });
export { postAccount };
