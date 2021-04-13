<template>
  <div :class="classes">
    <div class="game-stat__header">
      <slot name="header" />
    </div>
    <div class="game-stat__card">
      <div class="game-stat__value">
        <slot name="stat" />
      </div>
      <div class="game-stat__label">
        <slot name="label" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameStat",
  props: {},
  setup() {
    return {};
  },
  computed: {
    classes() {
      return {
        "game-stat": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.game-stat {
  &__header {
    display: block;
    font-size: 1.625em;
    @include font("Montserrat", "medium");
    margin: 1em 0 0.5em 0;
    line-height: 1.15;
    letter-spacing: $tracking-tight;
  }
  &__card {
    padding: 1em;
    text-align: center;
  }
  &__value {
    display: block;
    font-size: 2.625em;
    @include font("Montserrat", "extra-bold");
    line-height: 1.4;
    letter-spacing: $tracking-tight;
  }
  &__label {
    display: block;
    font-size: 0.8125em;
    @include font("Montserrat", "normal");
    line-height: 1;
    letter-spacing: $tracking-tight;
    text-transform: capitalize;
  }
}
</style>
