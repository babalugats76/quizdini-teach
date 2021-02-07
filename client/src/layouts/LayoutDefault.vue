<template>
  <div class="p-4">
    <header class="app-header">
      <app-nav />
    </header>
    <main class="container">
      <slot />
    </main>
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

<style lang="scss" scoped></style>
