import { onMounted } from "vue";
import { useVerify } from "@hooks";
export default {
  setup: () => {
    const { verify } = useVerify();
    onMounted(() => verify());
  },
  render: () => null,
};
