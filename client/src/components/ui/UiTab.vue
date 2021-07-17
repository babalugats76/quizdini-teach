<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UiTab",
  props: {
    title: {
      type: String,
      default: "Tab",
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
  computed: {
    classes() {
      return {
        "ui-tab": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
