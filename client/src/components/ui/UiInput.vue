<template>
  <label>
    {{ label }}
    <input
      v-model="input"
      autocomplete="autocomplete ? 'on' : null"
      :class="classes"
      :name="name"
      :type="type"
    />
    <ui-error v-if="errors" :errors="errors" />
  </label>
</template>

<script>
import { computed /*ref, toRef*/ } from "vue";
import UiError from "./UiError";

export default {
  name: "UiInput",
  components: {
    UiError,
  },
  props: {
    autocomplete: {
      type: Boolean,
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
    // eslint-disable-next-line
    value: {
      type: String,
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

<style lang="scss" scoped></style>
