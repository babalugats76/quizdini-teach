<template>
  <label :class="classes">
    <input
      ref="inputRef"
      v-bind="$attrs"
      v-model="input"
      :autocomplete="autocomplete || 'off'"
      :name="name"
      type="checkbox"
      novalidate="true"
    />
    <slot />
  </label>
  <ui-error v-if="errors" :errors="errors" />
</template>

<script>
import { computed } from "vue";
import UiError from "./UiError";
import { focus } from "@mixins";

export default {
  name: "UiCheckbox",
  components: {
    UiError,
  },
  mixins: [focus],
  inheritAttrs: false,
  props: {
    autocomplete: {
      type: String,
      default: "off",
      required: false,
    },
    errors: {
      type: [Array, String],
      default: "",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line
    value: {
      type: Boolean,
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const input = computed({
      get: () => props.value,
      set: (value) => emit("update:value", value),
    });
    return {
      input,
    };
  },
  computed: {
    classes() {
      return {
        "ui-checkbox": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  display: block;
}

.ui-checkbox {
  > input[type="checkbox"] {
    margin-right: 0.5rem;
  }
}
</style>
