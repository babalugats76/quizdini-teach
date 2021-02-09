<template>
  <layout>
    <slot />
  </layout>
</template>

<script>
import Layout from "@/layouts/Layout";

export default {
  name: "AuthSuccess",
  components: {
    Layout,
  },
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
