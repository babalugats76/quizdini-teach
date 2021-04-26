import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { callApi, verifyAccount } from "@api";
import useState from "./useState";

export default function useVerify() {
  const [verified, setVerified] = useState(null);
  const route = useRoute();
  const router = useRouter();
  const { secret = "" } = route.query;

  const verify = async () => {
    const { data: { message = "" } = {}, error } = await callApi(verifyAccount)({ secret });
    if (error) return router.push({ name: "Login", params: { message } });
    return setVerified(true);
  };

  onMounted(() => verify());
  return { isVerified: readonly(verified), token: secret };
}
