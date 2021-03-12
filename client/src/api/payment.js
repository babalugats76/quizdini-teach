import { post } from "@/utils/fetch";
const PAYMENT_ENDPOINT = "/api/payment";
const postPayment = (credits) =>
  post({ url: `${PAYMENT_ENDPOINT}`, data: credits });
export { postPayment };
