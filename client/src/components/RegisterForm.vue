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
          :errors="errors['title']"
          tabindex="1"
          maxlength="10"
          @input="hasError('title') && validate('title')"
          @blur="validate('title')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="firstName"
          autocomplete="given-name"
          :errors="errors['firstName']"
          label="First Name"
          name="first-name"
          type="text"
          tabindex="2"
          @input="hasError('firstName') && validate('firstName')"
          @blur="validate('firstName')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="lastName"
          autocomplete="family-name"
          :errors="errors['lastName']"
          label="Last Name"
          name="last-name"
          type="text"
          tabindex="3"
          @input="hasError('lastName') && validate('lastName')"
          @blur="validate('lastName')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="city"
          autocomplete="address-level2"
          :errors="errors['city']"
          label="City"
          name="city"
          type="text"
          tabindex="4"
          maxlength="100"
          @input="hasError('city') && validate('city')"
          @blur="validate('city')"
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
          :errors="errors['country']"
          tabindex="5"
          @input="hasError('country') && validate('country')"
          @blur="validate('country')"
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
          :errors="errors['state']"
          tabindex="6"
          @input="hasError('state') && validate('state')"
          @blur="validate('state')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="email"
          autocomplete="email"
          :errors="errors['email']"
          label="Email"
          name="email"
          type="email"
          tabindex="7"
          @input="hasError('email') && validate('email')"
          @blur="validate('email')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="username"
          autocomplete="username"
          :errors="errors['username']"
          label="Username"
          name="username"
          type="text"
          tabindex="8"
          maxlength="20"
          @input="hasError('username') && validate('username')"
          @blur="validate('username')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="password"
          autocomplete="new-password"
          :errors="errors['password']"
          label="Password"
          name="password"
          type="password"
          tabindex="9"
          @input="hasError('password') && validate('password')"
          @blur="validate('password')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="confirmPassword"
          autocomplete="new-password"
          :errors="errors['confirmPassword']"
          label="Confirm Password"
          name="confirm-password"
          type="password"
          tabindex="10"
          @input="hasError('confirmPassword') && validate('confirmPassword')"
          @blur="validate('confirmPassword')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Register"
          :disabled="submitting || !changed /*|| !isTouched*/"
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

    // const values = reactive({
    //   city: "",
    //   confirmPassword: "",
    //   country: "",
    //   countryCode: "",
    //   email: "",
    //   firstName: "",
    //   lastName: "",
    //   password: "",
    //   state: "",
    //   stateCode: "",
    //   title: "",
    //   username: "",
    // });

    const meta = reactive({
      changed: false,
      errors: {},
      hasErrors: computed(() =>
        Object.keys(meta.errors).some((e) => !!meta.errors[e])
      ),
      isTouched: computed(() =>
        Object.keys(meta.touched).some((e) => !!meta.touched[e])
      ),
      message: "",
      submitting: false,
      touched: {},
    });

    const registerFormSchema = object({
      city: string().max(100, "City is too long (${max} characters allowed)"),
      confirmPassword: string().oneOf(
        [yupRef("password")],
        "Passwords mismatch"
      ),
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

    const validate = (field) =>
      registerFormSchema
        .validateAt(field, values)
        .then(() => {
          meta.errors[field] = "";
          meta.touched[field] = true;
        })
        .catch((err) => {
          meta.errors[field] = err.errors;
          meta.touched[field] = true;
        });

    function registerUser() {
      registerFormSchema
        .validate(values, { abortEarly: false })
        .then(() => {
          meta.errors = {};
          meta.submitting = true;
          return (
            postAccount(values)
              .then((res) => {
                const { error, data } = res || {};
                if (error) {
                  meta.submitting = false;
                  meta.touched = {};
                  meta.errors = {};
                  switch (data.code) {
                    case "DuplicateUsername":
                      values.username = "";
                    default:
                      break;
                  }
                  meta.message = data.message;
                  throw new Error("RegisterFailed");
                }
              })
              // .then(() => store.dispatch(`auth/${AUTH.FETCH}`))
              // .then(() => router.push({ name: "dashboard" }))
              .catch(() => {
                meta.touched = {};
                meta.submitting = false;
              })
          );
        })
        .catch((err) => {
          console.log(err);
          if (err.name === "ValidationError") {
            meta.errors = {};
            //console.log(JSON.stringify(err.inner, null, 4));
            err.inner.forEach((e) => {
              //console.log(e);
              if (!meta.errors.hasOwnProperty(e.path)) {
                // grab first error in validation chain
                meta.errors[e.path] = e.errors;
              }
            });
          }
          meta.submitting = false;
        });
    }

    const hasError = (field) => field in meta.errors && !!meta.errors[field];

    watch(
      () => values,
      (values) => {
        meta.changed = !_.isEqual(values, initialValues);
      },
      { deep: true }
    );

    return {
      countries,
      hasError,
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
