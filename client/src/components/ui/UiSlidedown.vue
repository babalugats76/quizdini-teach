<template>
  <transition name="top-down" @after-leave="dialogExited">
    <div class="ui-slidedown" v-if="show">
      <div class="ui-slidedown__mask">
        <div class="ui-slidedown__dialog">
          <div class="ui-slidedown__body">
            <div class="ui-slidedown__icon">
              <slot name="icon"></slot>
            </div>
            <div class="ui-slidedown__message">
              <slot name="message"></slot>
            </div>
          </div>
          <div class="ui-slidedown__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "UiSlidedown",
  props: ["show"],
  emits: ["exited"],
  setup(props, { emit }) {
    const dialogExited = () => {
      emit("exited", {});
    };
    return {
      dialogExited,
    };
  },
};
</script>

<style lang="scss">
$icon-size: 3.5rem;
$dialog-y-spacing: 1.5rem;
$dialog-x-spacing: 1.5rem;

.ui-slidedown {
  * {
    user-select: none;
  }

  &__mask {
    position: fixed; /* Stay in place */
    z-index: 5000; /* Sit on top */
    padding-top: 100px; /* Starting top position slidedown box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
  }
  &__dialog {
    position: relative;
    /* transform: translate(-50%, -50%); */
    top: 0%;
    left: 50%;
    max-width: 400px;
    height: auto;
    width: 80%;
    min-height: 100px;
    padding: $dialog-y-spacing $dialog-x-spacing;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: white;
    transform: translate(-50%, -50%);
    opacity: 1;
    overflow: hidden;
  }
  &__body,
  &__footer {
    &::after {
      display: block;
      content: "";
      clear: both;
    }
  }
  &__message,
  &__icon {
    float: left;
  }
  &__icon {
    width: $icon-size;
    height: $icon-size;
    > * {
      display: inline-block;
      width: inherit;
      height: inherit;
    }
  }
  &__message {
    width: calc(100% - #{$icon-size} - 1rem);
    padding: 0 0 0 1rem;
    font-size: 1rem;
    line-height: 1.2;
    letter-spacing: -0.03125rem;
  }
  &__footer {
    margin-top: $dialog-y-spacing;
  }
}

.top-down-enter-active,
.top-down-leave-active {
  transition: all 0.9s ease-in-out;
  .ui-slidedown__dialog {
    transition: all 0.9s ease-in-out;
  }
}

.top-down-enter-from,
.top-down-leave-to {
  .ui-slidedown__dialog {
    transform: translate(-50%, -200%);
  }
}
</style>
