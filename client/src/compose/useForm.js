import { computed, provide, reactive, ref, toRefs, unref, watch } from "vue";

export default function useForm({ emit, initialValues, schema }) {
  const values = reactive(JSON.parse(JSON.stringify(unref(initialValues))));
  const meta = reactive({ errors: {}, touched: {} });
  const hasErrors = computed(() => Object.keys(meta.errors).length > 0);
  const dirty = ref(false);
  const submitting = ref(false);

  const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

  watch(
    () => values,
    (values) => {
      console.log("dirty check");
      dirty.value = !JSON.stringify(values) !== JSON.stringify(unref(initialValues));
    },
    { deep: true }
  );

  const validateForm = () => {
    return schema
      .validate(values, { abortEarly: false })
      .then(() => {
        meta.errors = {};
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          meta.errors = err.inner.reduce((errors, e) => {
            // if (!(e.path in errors)) errors[e.path] = e.message;
            if (!(e.path in errors)) {
              errors[e.path] = new Array(e.message);
            } else {
              errors[e.path].push(e.message);
            }
            return errors;
          }, {});
        }
      });
  };

  const validateField = (field) => {
    return schema
      .validateAt(field, values, { abortEarly: false })
      .then(() => {
        const { [field]: remove, ...rest } = meta.errors;
        meta.errors = rest;
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          // meta.errors[field] = err.message;
          meta.errors[field] = Array.from(err.inner[0].errors);
        }
      });
  };

  const setTouched = (field) => {
    meta.touched[field] = true;
  };

  const setValues = (vals) => {
    Object.entries(vals).forEach(([key, val]) => {
      values[key] = val;
    });
  };

  const setValue = (field, value) => {
    setValues({ [field]: value });
  };

  const setDirty = (value) => {
    dirty.value = value;
  };

  const handleInput = (e) => {
    //const field = camelize(e.target.name);
    //validateField(field);
    validateForm();
  };

  const handleBlur = (e) => {
    const field = camelize(e.target.name);
    setTouched(field);
  };

  const handleSubmit = async () => {
    await validateForm();

    if (unref(hasErrors)) {
      const { schema: { fields = {} } = {} } = props;
      meta.touched = Object.keys(fields).reduce(
        (touched, field) => ({ ...touched, [field]: true }),
        {}
      );
      return emit("submit", {
        errors: meta.errors,
        values: null,
      });
    }

    return emit("submit", {
      values,
      setSubmitting: () => {
        submitting.value = true;
      },
      setSubmitted: () => {
        submitting.value = false;
        dirty.value = false;
        meta.touched = {};
      },
    });
  };

  provide("uiform", {
    setValue: setValue,
  });

  return {
    dirty,
    handleBlur,
    handleInput,
    handleSubmit,
    hasErrors,
    initialValues,
    setDirty,
    setValue,
    setValues,
    submitting,
    validateField,
    values,
    ...toRefs(meta),
  };
}
