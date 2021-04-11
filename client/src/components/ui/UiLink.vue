<template>
  <component
    :is="as"
    :class="classes"
    :href="href"
    :target="target"
    rel="noopener noreferrer"
    role="link"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: "UiLink",
  props: {
    href: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: false,
      default: "_blank",
    },
    as: {
      type: String,
      required: false,
      default: "a",
    },
  },
  computed: {
    classes() {
      return {
        "ui-link": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
