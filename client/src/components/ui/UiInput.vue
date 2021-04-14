<template>
  <label v-if="label" :for="name"> {{ label }} </label>
  <input
    v-bind="$attrs"
    ref="inputRef"
    v-model="input"
    :autocomplete="autocomplete || 'off'"
    :class="classes"
    :name="name"
    :type="type"
    novalidate="true"
  />
  <ui-error v-if="errors" :errors="errors" />
</template>

<script>
import { computed } from "vue";
import UiError from "./UiError";
import { focus } from "@mixins";

export default {
  name: "UiInput",
  components: {
    UiError,
  },
  mixins: [focus],
  inheritAttr: false,
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
    label: {
      type: String,
      default: "",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
      required: true,
    },
    value: {
      required: true,
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
        "ui-input": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  display: block;
}

.ui-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  outline: 1px solid gray;
}
</style>
