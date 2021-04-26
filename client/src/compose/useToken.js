import { onMounted, readonly } from "vue";
import { useRoute, useRouter } from "vue-router";
import { validateToken } from "@api";
import useState from "./useState";

export default function useToken() {
  const [valid, setValid] = useState(null);
  const route = useRoute();
  const router = useRouter();
  const { secret = "" } = route.query;

  const callApi = (cb) => async (...args) => {
    const response = await cb(args);
    const { data = null, error = null } = response;
    return {
      data,
      error,
      failed: error ? true : false,
      loaded: data ? true : false,
      loading: false,
    };
  };

  const validate = async () => {
    const { data: { message = "" } = {}, error } = await callApi(validateToken)(secret);
    // const response = await validateToken(secret);
    // const { data = null, error = null } = response;
    // const { message = "" } = data || {};
    if (error) return router.push({ name: "Login", params: { message } });
    return setValid(true);
  };
  onMounted(() => validate());
  return {
    isValid: readonly(valid),
    token: secret,
  };
}
