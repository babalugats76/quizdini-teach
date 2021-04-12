<template>
  <div :class="classes">
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
  text-align: center;
}
</style>
