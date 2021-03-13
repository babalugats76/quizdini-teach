<template>
  <layout-default>
    <h1 v-if="flashMessage">{{ flashMessage }}</h1>
    <h1>Welcome to the Dashboard</h1>
  </layout-default>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  name: "Dashboard",
  setup() {
    const route = useRoute();
    const { message: flashMessage } = route.params;
    return {
      flashMessage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
