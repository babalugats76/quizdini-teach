<template>
  <layout-default>
    <slot />
  </layout-default>
</template>

<script>
export default {
  name: "AuthSuccess",
  created() {
    window.document.body.style.display = "none";
    if (window.opener) {
      window.opener.open("/dashboard", "_self");
      window.opener.focus();
      window.close();
    }
  },
};
</script>

<style lang="scss" scoped></style>
