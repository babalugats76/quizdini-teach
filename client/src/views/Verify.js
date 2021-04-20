import { onMounted } from "vue";
import { useVerify } from "@hooks";
export default {
  setup: () => {
    const { verify } = useVerify();
    onMounted(() => {
      console.log("mounted...executing verify");
      verify();
    });
  },
  render: () => null,
};
