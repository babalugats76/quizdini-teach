<script>
/*  <template>
  <slot
    :blur="handleBlur"
    :dirty="dirty"
    :errors="errors"
    :handleSubmit="handleSubmit"
    :hasErrors="hasErrors"
    :input="handleInput"
    :submitting="submitting"
    :touched="touched"
    :validateField="validateField"
    :values="values"
  />
</template> */

import { h, /* inject */ ref } from "vue";
import { useForm } from "@hooks";

/* eslint-ignore-require-prop-types */
export default {
  name: "UiForm",
  props: {
    initialValues: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    schema: {
      required: true,
    },
    tag: {
      type: String,
      default: "div",
      required: false,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const initialValues = ref(props.initialValues);
    // const schema = ref(props.schema);
    const {
      dirty,
      errors,
      handleBlur,
      handleInput,
      handleSubmit,
      hasErrors,
      setDirty,
      setValue,
      setValues,
      submitting,
      touched,
      validateField,
      values,
    } = useForm({ emit, initialValues, schema: props.schema });
    return {
      dirty,
      errors,
      handleBlur,
      handleInput,
      handleSubmit,
      hasErrors,
      setDirty,
      setValue,
      setValues,
      submitting,
      touched,
      validateField,
      values,
    };
  },
  render() {
    const { $slots } = this;
    const $vnodes = $slots
      ? $slots.default({
          blur: this.handleBlur,
          dirty: this.dirty,
          errors: this.errors,
          handleSubmit: this.handleSubmit,
          hasErrors: this.hasErrors,
          input: this.handleInput,
          submitting: this.submitting,
          touched: this.touched,
          validateField: this.validateField,
          values: this.values,
        })
      : [];
    if ($vnodes.length === 0) return $vnodes[0];
    return h(this.tag || "form", $vnodes);
  },
};
</script>
