<template>
  <label :for="name"> {{ label }} </label>
  <input
    v-bind="$attrs"
    ref="inputRef"
    v-model="input"
    :list="id"
    :class="classes"
    :name="name"
    novalidate="true"
    @input="onInputChange($event)"
  />
  <datalist :id="id">
    <option v-for="option in options" :key="option.key" :data-value="option.value">
      {{ option.text }}
    </option>
  </datalist>
  <ui-error v-if="errors" :errors="errors" />
</template>

<script>
import { computed } from "vue";
import { focus } from "@mixins/";
import UiError from "./UiError";
export default {
  name: "UiDatalist",
  components: {
    UiError,
  },
  mixins: [focus],
  inheritAttr: false,
  props: {
    // eslint-disable-next-line
    code: {
      type: String,
      required: false,
    },
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
  emits: ["update:value", "update:code"],
  setup(props, { emit }) {
    const input = computed({
      get: () => props.value,
      set: (value) => emit("update:value", value),
    });
    const onInputChange = (evt) => {
      const match = Array.from(evt.target.list.options).find(
        (o) => o.innerHTML === evt.target.value
      );
      emit("update:code", match ? match.dataset["value"] : "");
    };

    return {
      input,
      onInputChange,
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
  display: block;
}

.ui-datalist {
  width: 100%;
  padding: 0.5rem 0.75rem;
  outline: 1px solid gray;
}
</style>
