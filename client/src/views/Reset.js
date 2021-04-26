import { useToken } from "@hooks";
export default {
  setup() {
    return useToken();
  },
  render() {
    return (
      <>
        <div>{this.token}</div>
        <>{this.isValid ? <p>Super Valid</p> : <p>Not so super valid</p>}</>
      </>
    );
  },
};
