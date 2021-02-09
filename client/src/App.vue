<template>
  <component :is="layout">
    <router-view v-model:layout="layout" />
  </component>
</template>

<script>
export default {
  name: "App",
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
