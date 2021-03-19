import { get, post } from "@/utils/fetch";
const ENDPOINT = "/api/payments";
const postPayment = (credits) => post({ url: `${ENDPOINT}`, data: credits });
const getPayments = () => get({ url: `${ENDPOINT}` });

export { getPayments, postPayment };
