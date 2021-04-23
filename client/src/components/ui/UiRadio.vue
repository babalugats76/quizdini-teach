<script>
import { computed } from "vue";
import UiError from "./UiError";

export const UiRadio = {
  name: "UiRadio",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    selected: {
      type: [String, Number],
    },
    type: {
      type: String,
      default: "radio",
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["update:selected"],
  setup(props, { attrs, emit }) {
    const onChecked = (evt) => emit("update:selected", evt.target.value);
    return () => {
      const { label, name, selected, type, value } = props;
      return (
        <div class="ui-radio" {...attrs}>
          <label class="ui-radio__label">
            <input
              checked={selected === value}
              class="ui-radio__input"
              id={value}
              name={name}
              onClick={onChecked}
              ref="inputRef"
              type={type}
              value={value}
            />
            {label}
          </label>
        </div>
      );
    };
  },
};

export const UiRadioGroup = {
  name: "UiRadioGroup",
  inheritAttrs: false,
  components: {
    UiError,
    UiRadio,
  },
  props: {
    errors: {
      type: [Array, String],
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
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
  emits: ["update:value"],
  setup(props, { emit }) {
    const onSelected = computed({
      get: () => props.value,
      set: (value) => emit("update:value", value),
    });
    return {
      onSelected,
    };
  },
  render() {
    const { errors, name, options } = this.$props;
    return (
      <>
        <div class="ui-radio-group" {...this.$attrs}>
          {options.map((o) => (
            <UiRadio
              key={o.key}
              label={o.text}
              name={name}
              value={o.value}
              v-model={[this.onSelected, "selected"]}
            />
          ))}
        </div>
        {errors ? <ui-error errors={errors} /> : ""}
      </>
    );
  },
};
export default UiRadioGroup;
</script>

<style lang="scss">
.ui-radio-group {
  > .ui-radio {
    display: inline-block;
  }
}

.ui-radio {
  padding: 0.375rem;
  font-size: inherit;
  &__label {
    @include font("Montserrat", "medium");
    line-height: 1.4;
  }
  &__input {
    margin: 0.5rem;
  }
}
</style>
