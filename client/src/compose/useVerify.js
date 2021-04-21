import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyAccount } from "@api";
import useLoader from "./useLoader";

export default function useVerify() {
  const route = useRoute();
  const router = useRouter();
  const { secret = "" } = route.query;
  const { data /*, executions, error, failed, initialized, loaded, loading*/ } = useLoader({
    callback: () => verifyAccount({ secret }),
    immediate: true,
    deps: () => [],
  });
  watch(
    data,
    (data) => {
      const { message = "" } = data || {};
      return router.push({ name: "Login", params: { message } });
    },
    { immediate: false }
  );
}
