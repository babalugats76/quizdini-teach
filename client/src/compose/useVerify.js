// import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { verifyAccount } from "@api";

export default function useVerify() {
  const router = useRouter();
  const route = useRoute();
  // const { secret = undefined } = route.params;
  const { secret = undefined } = route.query;

  const verify = () => {
    return verifyAccount({ secret })
      .then((response) => {
        const { data = null, error = null } = response;
        const { message } = data;
        const redirectTo = error ? "NotFound" : "Login";
        return router.push({ name: redirectTo, params: { message } });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return {
    verify,
  };
}
