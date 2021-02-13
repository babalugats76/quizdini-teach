import { get } from "@/utils/fetch";
const ENDPOINT = "/api/countries";
const getCountries = () => get({ url: `${ENDPOINT}` });
export { getCountries };
