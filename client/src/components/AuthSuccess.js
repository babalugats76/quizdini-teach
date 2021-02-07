export default {
  name: "auth-success",
  created() {
    window.document.body.style.display = "none";
    if (window.opener) {
      window.opener.open("/dashboard", "_self");
      window.opener.focus();
      window.close();
    }
  },
  render() {
    return this.$slots.default[0];
  },
};
