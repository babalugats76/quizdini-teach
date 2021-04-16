import { useVerify } from "@hooks";
export default {
  setup: () => {
    const { token } = useVerify();
    console.log(token);
  },
  render: () => null,
};
