<script>
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

export const UiRadioGroup = {};
export default UiRadioGroup;
</script>

<style lang="scss">
.ui-radio {
  display: inline-block;
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
