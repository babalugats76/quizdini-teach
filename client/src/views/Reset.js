import { ResetForm } from "@components";
import { useToken } from "@hooks";

export default {
  setup() {
    return useToken();
  },
  render() {
    return <LayoutDefault>{this.isValid ? <ResetForm token={this.token} /> : ""}</LayoutDefault>;
  },
};
