<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
import { severity } from "@mixins/";

export default {
  name: "UiMessage",
  mixins: [severity],
  setup(props, { emit }) {
    return {};
  },
  computed: {
    classes() {
      return {
        "ui-message": true,
        ...this.severityClasses,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
