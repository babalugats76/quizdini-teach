<template>
  <label v-if="label" :for="name"> {{ label }} </label>
  <select
    v-bind="$attrs"
    ref="inputRef"
    v-model="input"
    :autocomplete="autocomplete || 'off'"
    :class="classes"
    :name="name"
    :multiple="multiple"
    novalidate="true"
  >
    <option v-for="option in options" :key="option.key" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <ui-error v-if="errors" :errors="errors" />
</template>

<script>
import { computed } from "vue";
import { focus } from "@mixins";
import UiError from "./UiError";
export default {
  name: "UiDropdown",
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
    disabled: {
      type: Boolean,
      default: false,
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
    multiple: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: [Array],
      required: true,
    },
    value: {
      type: [String, Number],
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
        "ui-dropdown": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
