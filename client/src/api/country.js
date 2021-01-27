import { get } from "@/utils/fetch";
const ENDPOINT = "/api/countries";
const fetchCountries = () => get({ url: `${ENDPOINT}` });
export { fetchCountries };
