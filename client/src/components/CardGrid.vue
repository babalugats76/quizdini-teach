<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  name: "CardGrid",
  props: {
    type: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup() {
    return {};
  },
  computed: {
    classes() {
      return {
        "card-grid": true,
        [`card-grid--${this.type}`]: this.type,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$game-card-min-width: 288px;

.card-grid {
  display: grid;
  margin: 1rem;
  grid-gap: 0.75rem;
  gap: 0.75rem;
  &--game {
    grid-template-columns: repeat(auto-fill, minmax($game-card-min-width, 1fr));
  }
}
</style>
