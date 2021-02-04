<template>
  <div>
    <header class="app-header">
      <app-nav></app-nav>
    </header>
    <main class="container">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppNav from "@/components/AppNav";

export default {
  name: "app",
  components: {
    AppNav,
  },
};
</script>

<style lang="scss">
@import "assets/styles/quizdini.scss";
</style>
