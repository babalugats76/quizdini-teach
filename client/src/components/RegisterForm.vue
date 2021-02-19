<template>
  <div class="register">
    <form class="register__form" @submit.prevent="registerUser">
      <div v-if="message && !isTouched">{{ message }}</div>
      <div class="form-input">
        <ui-datalist
          id="title"
          v-model:value="title"
          autofocus
          autocomplete="honorific-prefix"
          :options="titles"
          label="Title"
          name="title"
          :errors="errors.title"
          tabindex="1"
          maxlength="10"
          @input="errors.title && validate('title')"
          @blur="handleBlur('title')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="firstName"
          autocomplete="given-name"
          :errors="errors.firstName"
          label="First Name"
          name="first-name"
          type="text"
          tabindex="2"
          @input="errors.firstName && validate('firstName')"
          @blur="handleBlur('firstName')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="lastName"
          autocomplete="family-name"
          :errors="errors.lastName"
          label="Last Name"
          name="last-name"
          type="text"
          tabindex="3"
          @input="errors.lastName && validate('lastName')"
          @blur="handleBlur('lastName')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="city"
          autocomplete="address-level2"
          :errors="errors.city"
          label="City"
          name="city"
          type="text"
          tabindex="4"
          maxlength="100"
          @input="errors.city && validate('city')"
          @blur="handleBlur('city')"
        />
      </div>
      <div class="form-input">
        <ui-datalist
          id="countries"
          v-model:value="country"
          v-model:code="countryCode"
          autocomplete="country-name"
          :options="countries"
          label="Country"
          name="country"
          :errors="errors.country"
          tabindex="5"
          @input="errors.country && validate('country')"
          @blur="handleBlur('country')"
        />
      </div>
      <div v-show="countryCode === 'US'" class="form-input">
        <ui-datalist
          id="states"
          v-model:value="state"
          v-model:code="stateCode"
          autocomplete="address-level1"
          :options="states"
          label="State"
          name="state"
          :errors="errors.state"
          tabindex="6"
          @input="errors.state && validate('state')"
          @blur="handleBlur('state')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="email"
          autocomplete="email"
          :errors="errors.email"
          label="Email"
          name="email"
          type="email"
          tabindex="7"
          @input="errors.email && validate('email')"
          @blur="handleBlur('email')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="username"
          autocomplete="username"
          :errors="errors.username"
          label="Username"
          name="username"
          type="text"
          tabindex="8"
          maxlength="20"
          @input="errors.username && validate('username')"
          @blur="handleBlur('username')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="password"
          autocomplete="new-password"
          :errors="errors.password"
          label="Password"
          name="password"
          type="password"
          tabindex="9"
          @input="errors.password && validate('password')"
          @blur="handleBlur('password')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="confirmPassword"
          autocomplete="new-password"
          :errors="errors.confirmPassword"
          label="Confirm Password"
          name="confirm-password"
          type="password"
          tabindex="10"
          @input="errors.confirmPassword && validate('confirmPassword')"
          @blur="handleBlur('confirmPassword')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Register"
          :disabled="isSubmitting || !isDirty || !isTouched || !isValid"
          tabindex="11"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from "vue";
import _ from "lodash";
import { object, string, ref as yupRef } from "yup";
import { postAccount } from "@/api/account";

import UiDatalist from "@/components/ui/UiDatalist";
import UiInput from "@/components/ui/UiInput";
import useCountries from "@/compose/useCountries";
import useStates from "@/compose/useStates";

const registerFormSchema = object({
  city: string().max(100, "City is too long (${max} characters allowed)"),
  confirmPassword: string().oneOf([yupRef("password")], "Passwords mismatch"),
  country: string().required("Country is required"),
  email: string().required("Email is required").email("Invalid email"),
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  password: string() /* Add rules for password complexity */
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/,
      "Password must be 8 or more characters long and include upper, lower, numeric and special @$!%*#?& characters"
    ),
  state: string().when("countryCode", {
    is: (val) => val === "US",
    then: string().required("State is required"),
  }),
  title: string().max(10, "Title too long (${max} characters allowed)"),
  username: string()
    .required("Username is required")
    .min(6, "Username is too short (${min} characters minimum)")
    .max(20, "Username is too long (${max} characters allowed)"),
});

export default {
  name: "RegisterForm",
  components: { UiDatalist, UiInput },
  setup() {
    const { countries } = useCountries();
    const { states } = useStates();

    const titles = [
      { key: 0, text: "Mr.", value: "Mr." },
      { key: 1, text: "Mrs.", value: "Mrs." },
      { key: 2, text: "Ms.", value: "Ms." },
      { key: 3, text: "Prof.", value: "Prof." },
      { key: 4, text: "Miss", value: "Miss" },
      { key: 5, text: "Dr.", value: "Dr." },
    ];

    const initialValues = reactive({
      city: "",
      confirmPassword: "",
      // cookie: false,
      country: "",
      countryCode: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      // privacy: false,
      state: "",
      stateCode: "",
      // terms: false,
      title: "",
      username: "",
    });

    const values = reactive({ ...initialValues });

    const meta = reactive({
      changed: false,
      dirty: {},
      errors: {},
      isDirty: computed(
        () =>
          meta.changed || Object.keys(meta.dirty).some((e) => !!meta.dirty[e])
      ),
      isSubmitting: false,
      isTouched: computed(() =>
        Object.keys(meta.touched).some((e) => !!meta.touched[e])
      ),
      isValid: computed(
        () => !Object.keys(meta.errors).some((e) => !!meta.errors[e])
      ),
      message: "",
      touched: {},
    });

    const setTouched = (field) => {
      meta.touched[field] = true;
    };

    const setDirty = (field) => {
      if (!_.isEqual(values[field], initialValues[field])) {
        meta.dirty[field] = true;
      } else {
        const { [field]: remove, ...rest } = meta.dirty;
        meta.dirty = rest;
      }
    };

    const handleBlur = async (field) => {
      await validate(field).then(() => {
        setTouched(field);
        setDirty(field);
      });
    };

    const validate = (field) =>
      registerFormSchema
        .validateAt(field, values, { abortEarly: false })
        .then(() => {
          const { [field]: remove, ...rest } = meta.errors;
          meta.errors = rest;
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            meta.errors[field] = Array.from(err.inner[0].errors);
          }
        });

    function registerUser() {
      registerFormSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          meta.isSubmitting = true;
          return (
            postAccount(values)
              .then((res) => {
                const { error, data } = res || {};
                if (error) {
                  switch (data.code) {
                    case "DuplicateUsername":
                      values.username = "";
                      setDirty("username");
                      break;
                    case "DuplicateEmail":
                      values.email = "";
                      setDirty("email");
                      break;
                    default:
                      break;
                  }
                  meta.message = data.message;
                  throw new Error("RegisterFailed");
                }
              })
              // .then(() => store.dispatch(`auth/${AUTH.FETCH}`))
              // .then(() => router.push({ name: "dashboard" }))
              .catch((err) => {
                console.error(err);
              })
          );
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            meta.errors = err.inner.reduce((errors, e) => {
              if (!(e.path in errors)) errors[e.path] = Array.from(e.errors);
              return errors;
            }, {});
          }
        })
        .finally(() => {
          meta.touched = {};
          meta.isSubmitting = false;
        });
    }

    watch(
      () => values,
      (values) => {
        meta.changed = !_.isEqual(values, initialValues);
      },
      { deep: true }
    );

    return {
      countries,
      handleBlur,
      registerUser,
      states,
      titles,
      validate,
      ...toRefs(meta),
      ...toRefs(values),
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style lang="scss" scoped></style>
