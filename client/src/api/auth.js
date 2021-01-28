import { get } from "@/utils/fetch";
const ENDPOINT = "/api/current_user";
const getAuth = () => get({ url: `${ENDPOINT}` });
export { getAuth };
