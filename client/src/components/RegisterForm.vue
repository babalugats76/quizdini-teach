<template>
  <div class="register">
    <form class="register__form" @submit.prevent="registerUser">
      <div v-if="message && !isValid">{{ message }}</div>
      <pre>{{ JSON.stringify(touched, null, 4) }} </pre>
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
          @focus="setFieldTouched('title')"
          @input="errors.title & validateField('title')"
          @blur="handleBlur('title', true)"
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
          @focus="setFieldTouched('firstName')"
          @input="errors.firstName && validateField('firstName')"
          @blur="handleBlur('firstName', true)"
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
          @focus="setFieldTouched('lastName')"
          @input="errors.lastName && validateField('lastName')"
          @blur="handleBlur('lastName', true)"
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
          @focus="setFieldTouched('city')"
          @input="errors.city && validateField('city')"
          @blur="handleBlur('city', true)"
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
          @focus="setFieldTouched('country')"
          @input="errors.country && validateField('country')"
          @blur="handleBlur('country', true)"
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
          @focus="setFieldTouched('state')"
          @input="errors.state && validateField('state')"
          @blur="handleBlur('state', true)"
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
          @focus="setFieldTouched('email')"
          @input="errors.email && validateField('email')"
          @blur="handleBlur('email', true)"
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
          @focus="setFieldTouched('username')"
          @input="errors.username && validateField('username')"
          @blur="handleBlur('username', true)"
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
          @focus="setFieldTouched('password')"
          @input="errors.password && validateField('password')"
          @blur="handleBlur('password', true)"
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
          @focus="setFieldTouched('confirmPassword')"
          @input="errors.confirmPassword && validateField('confirmPassword')"
          @blur="handleBlur('confirmPassword', true)"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          :value="isSubmitting ? 'Loading' : 'Register'"
          :disabled="isSubmitting || !isDirty || !isValid"
          tabindex="11"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
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
    const router = useRouter();
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
      isTouched: computed(
        () => !Object.keys(meta.touched).some((e) => !!meta.touched[e])
      ),
      isValid: computed(
        () => !Object.keys(meta.errors).some((e) => !!meta.errors[e])
      ),
      message: "",
      touched: {},
    });

    const setFieldDirty = (field) => {
      if (!_.isEqual(values[field], initialValues[field])) {
        meta.dirty = Object.assign({}, meta.dirty, { [field]: true });
      } else {
        const { [field]: remove, ...rest } = meta.dirty;
        meta.dirty = rest;
      }
    };

    const setFieldTouched = (field) => {
      // console.log("setTouch", field);
      meta.touched = Object.assign({}, meta.touched, { [field]: true });
    };

    const validateField = (field) => {
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
        })
        .finally(() => {
          // setFieldTouched(field);
          setFieldDirty(field);
        });
    }; // console.log("setTouch", field);

    const handleBlur = (field, validateOnBlur = false) => {
      setFieldTouched(field);
      validateOnBlur && validateField(field);
    };

    const registerUser = async () => {
      registerFormSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          meta.isSubmitting = true;
          return postAccount(values)
            .then((res) => {
              const { error, data } = res || {};
              if (error) {
                switch (data.code) {
                  case "DuplicateUsername":
                    values.username = "";
                    meta.errors["username"] = ["Username already taken"];
                    // setDirty("username");
                    break;
                  case "DuplicateEmail":
                    values.email = "";
                    meta.errors["email"] = ["Email already taken"];
                    // setDirty("email");
                    break;
                  default:
                    break;
                }
                meta.message = data.message;
                throw new Error("RegisterFailed");
              }
              return data.message;
            })
            .then((message) =>
              router.push({ name: "login", params: { message } })
            )
            .catch((err) => {
              console.error(err);
            });
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
          meta.dirty = {};
          meta.changed = false;
          meta.isSubmitting = false;
        });
    };

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
      setFieldTouched,
      registerUser,
      states,
      titles,
      validateField,
      ...toRefs(meta),
      ...toRefs(values),
    };
  },
  // computed: {
  //   console: () => console,
  //   window: () => window,
  // },
};
</script>

<style lang="scss" scoped></style>
