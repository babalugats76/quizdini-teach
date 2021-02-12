<template>
  <layout name="LayoutDefault">
    <LoginForm />
  </layout>
</template>

<script>
import { LoginForm } from "@/components/";

export default {
  name: "Login",
  components: {
    LoginForm,
  },
};
</script>

<style lang="scss" scoped></style>
