<template>
  <component :is="layout">
    <router-view v-model:layout="layout" />
  </component>
</template>

<script>
import LayoutDefault from "@/layouts/LayoutDefault";

export default {
  name: "App",
  components: {
    LayoutDefault,
  },
  data() {
    return {
      layout: "div",
    };
  },
};
</script>

<style lang="scss">
@import "~styles/quizdini.scss";
</style>
