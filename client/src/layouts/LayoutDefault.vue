<template>
  <div class="app">
    <header class="app__header">
      <app-nav class="app__nav" />
    </header>
    <main class="app__main">
      <slot />
    </main>
    <footer class="app__footer">&copy; Quizdini 2013-21</footer>
  </div>
</template>

<script>
import AppNav from "@/components/AppNav";
export default {
  name: "LayoutDefault",
  components: {
    AppNav,
  },
};
</script>

<style lang="scss" scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  &__header {
    display: block;
    width: 100%;
    text-align: center;
    background-color: var(--zaffre);
    color: var(--white);
  }
  &__nav {
    width: 100%;
  }
  &__main {
    padding: 1rem;
  }
  &__footer {
    width: 100%;
    text-align: center;
  }
}
</style>
