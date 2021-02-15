<template>
  <label>
    {{ label }}
    <input v-model="input" list="id" :class="classes" :name="name" />
    <datalist id="id">
      <option
        v-for="option in options"
        :key="option.key"
        :data-value="option.value"
      >
        {{ option.text }}
      </option>
    </datalist>
    <ui-error v-if="errors" :errors="errors" />
  </label>
</template>

<script>
import { computed } from "vue";
import UiError from "./UiError";

export default {
  name: "UiDatalist",
  components: {
    UiError,
  },
  inheritAttr: false,
  props: {
    errors: {
      type: [Array, String],
      default: "",
      required: false,
    },
    id: {
      type: String,
      required: true,
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
    options: {
      type: [Array],
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
        "ui-datalist": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  font-weight: bold;
}

.ui-datalist {
  outline: 1px solid gray;
}
</style>
