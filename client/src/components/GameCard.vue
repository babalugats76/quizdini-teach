<template>
  <div :class="classes">
    <div class="game-card__body">
      <div class="game-card__badge">
        <slot name="badge" />
      </div>
      <div class="game-card__title">
        <slot name="title" />
      </div>
      <div class="game-card__details">
        <slot name="details" />
      </div>
    </div>
    <div class="game-card__footer"></div>
  </div>
</template>

<script>
export default {
  name: "GameCard",
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
        "game-card": true,
        [`game-card--${this.type}`]: this.type,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$game-card-title-lines: 1;
$match-card-title-lines: 3;

.game-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-radius: 0.75rem;
  --border-opacity: 1;
  border-color: #2d3748;
  border-color: rgba(45, 55, 72, var(--border-opacity));
  --border-opacity: 0.1;
  --bg-opacity: 1;
  background-color: #fff;
  background-color: rgba(255, 255, 255, var(--bg-opacity));
  z-index: 0;
  box-shadow: none;
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  &__body {
    position: relative;
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    min-height: 7rem;
  }
  &__title {
    flex: 1 1 0%;
    padding-right: 5rem;
    margin-bottom: 1rem;
    @include font("Montserrat", "extra-bold");
    letter-spacing: $tracking-tight;
    font-size: 1.1875rem;
    line-height: 1.1;
    /* replace with reference to 'charcoal' at some point */
    color: #364359;
    @include clamp-lines($game-card-title-lines);
  }
  &__footer {
    flex: none;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom-right-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
    --bg-opacity: 1;
    background-color: #f7fafc;
    background-color: rgba(247, 250, 252, var(--bg-opacity));
    overflow: hidden;
  }
  @at-root &--match &__title {
    @include clamp-lines($match-card-title-lines);
  }
}
</style>
