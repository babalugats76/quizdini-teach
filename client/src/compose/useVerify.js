import { useRoute } from "vue-router";

export default function useVerify() {
  const route = useRoute();
  const { secret: token = undefined } = route.params;
  return {
    token,
  };
}
