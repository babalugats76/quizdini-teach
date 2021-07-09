<template>
  <div class="ui-modal">
    <teleport to="#modals">
      <transition :appear="appear" :duration="duration" name="modal" @after-leave="$emit('exited')">
        <div
          v-if="show"
          :class="maskClasses"
          :style="{
            transitionDuration: `${duration}ms`,
            animationDuration: `${duration}ms`,
          }"
        >
          <div class="ui-modal__wrapper">
            <div
              v-bind="$attrs"
              class="ui-modal__container"
              :style="{ transitionDuration: `${duration}ms` }"
            >
              <slot />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: "UiModal",
  inheritAttrs: false,
  props: {
    appear: {
      type: Boolean,
    },
    duration: {
      type: Number,
      default: 1000,
      required: false,
    },
    fadeType: {
      type: String,
      default: "light-to-dark",
      required: false,
    },
    show: {
      type: Boolean,
    },
  },
  emits: ["close", "exited"],
  computed: {
    maskClasses() {
      return {
        "ui-modal__mask": true,
        [`ui-modal__mask--${this.fadeType}`]: this.fadeType,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$modal-mask-color: $tertiary;
$modal-mask-opacity: 0.6;

.modal-enter-active,
.modal-enter-from,
.modal-enter-to,
.modal-leave-active,
.modal-leave-from,
.modal-leave-to {
  transition: transform 1s cubic-bezier(0.45, 1.28, 0.39, 0.78), opacity 1s ease-in-out,
    background-color 1s ease-in-out;
}

.modal-enter-active .ui-modal__container,
.modal-enter-from .ui-modal__container {
  opacity: 0;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}

.modal-enter-to .ui-modal__container {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}

.modal-leave-active .ui-modal__container,
.modal-leave-from .ui-modal__container {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}

.modal-leave-to .ui-modal__container {
  opacity: 0;
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}

.ui-modal {
  &__mask {
    $mask: &;
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: table;
    @include bg-color($modal-mask-color, $modal-mask-opacity);
    transition-property: background-color;
    @at-root #{$mask}--dark-to-light.modal-enter-active,
      #{$mask}--dark-to-light.modal-enter-from {
      --bg-opacity: 1;
    }
    @at-root #{$mask}--light-to-dark.modal-enter-active,
      #{$mask}--light-to-dark.modal-enter-from {
      --bg-opacity: 0;
    }
    @at-root #{$mask}--dark-to-light.modal-enter-to {
      --bg-opacity: #{$modal-mask-opacity};
    }
    @at-root #{$mask}--light-to-dark.modal-enter-to {
      --bg-opacity: #{$modal-mask-opacity};
    }
    @at-root #{$mask}.modal-leave-active,
      #{$mask}.modal-leave-from {
      --bg-opacity: #{$modal-mask-opacity};
    }
    @at-root #{$mask}.modal-leave-to {
      --bg-opacity: 0;
    }
  }

  &__wrapper {
    display: table-cell;
    padding: 1rem;
    vertical-align: middle;
  }

  &__container {
    display: flex;
    width: 100%;
    max-width: 500px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 0.875rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    @include font("Montserrat");
  }
}
</style>
