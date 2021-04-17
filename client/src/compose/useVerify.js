import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyAccount } from "@api";

export default function useVerify() {
  const router = useRouter();
  const route = useRoute();
  const { secret = undefined } = route.params;

  const verify = () => {
    return verifyAccount({ secret })
      .then((results) => {
        const { data = null, error = null } = results || {};
        const { message } = data;
        const redirectTo = error ? "NotFound" : "Login";
        return router.push({ name: redirectTo, params: { message } });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  watch(
    () => [],
    () => verify(),
    { immediate: true }
  );
}
