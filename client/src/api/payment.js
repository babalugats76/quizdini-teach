import { post } from "@/utils/fetch";
const INTENT_ENDPOINT = "/api/create-payment-intent";
const postPaymentIntent = (credits) =>
  post({ url: `${INTENT_ENDPOINT}`, data: credits });
export { postPaymentIntent };
