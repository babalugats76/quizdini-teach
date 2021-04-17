import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyAccount } from "@api";

export default function useVerify() {
  const router = useRouter();
  const route = useRoute();
  const { secret = undefined } = route.params;

  const verify = () => {
    return verifyAccount({ secret })
      .then((response) => {
        console.log(JSON.stringify(response, null, 4));
        const { data = null, error = null } = response;
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
