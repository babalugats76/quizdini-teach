import { get } from "@/utils/fetch";
const ENDPOINT = "/api/states";
const getStates = () => get({ url: `${ENDPOINT}` });
export { getStates };
