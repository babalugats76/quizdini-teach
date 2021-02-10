<template>
  <layout name="LayoutDefault">
    <LoginForm />
  </layout>
</template>

<script>
import Layout from "@/layouts/Layout";
import { LoginForm } from "@/components/";

export default {
  name: "Login",
  components: {
    Layout,
    LoginForm,
  },
};
</script>

<style lang="scss" scoped></style>
