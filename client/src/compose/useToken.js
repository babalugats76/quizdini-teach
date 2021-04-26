import { onMounted, readonly } from "vue";
import { useRoute, useRouter } from "vue-router";
import { callApi, validateToken } from "@api";
import useState from "./useState";

export default function useToken() {
  const [valid, setValid] = useState(null);
  const route = useRoute();
  const router = useRouter();
  const { secret = "" } = route.query;

  const validate = async () => {
    const { data: { message = "" } = {}, error } = await callApi(validateToken)(secret);
    if (error) return router.push({ name: "Login", params: { message } });
    return setValid(true);
  };

  onMounted(() => validate());
  return { isValid: readonly(valid), token: secret };
}
