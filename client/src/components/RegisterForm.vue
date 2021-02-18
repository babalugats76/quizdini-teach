<template>
  <div class="register">
    <form class="register__form" @submit.prevent="loginUser">
      <div v-if="errors && !isDirty && message">{{ message }}</div>
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
          @blur="validate('title')"
          @keyup="hasError('title') && validate('title')"
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
          @blur="validate('firstName')"
          @keyup="hasError('firstName') && validate('firstName')"
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
          @blur="validate('lastName')"
          @keyup="hasError('lastName') && validate('lastName')"
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
          @blur="validate('city')"
          @keyup="hasError('city') && validate('city')"
        />
      </div>
      <div class="form-input">
        <ui-datalist
          id="countries"
          v-model:value="countrySearch"
          v-model:code="countryCode"
          autocomplete="country-name"
          :options="countries"
          label="Country"
          name="country"
          :errors="errors['country']"
          tabindex="5"
          @blur="validate('country')"
          @keyup="hasError('country') && validate('country')"
        />
      </div>
      <div v-show="countryCode === 'US'" class="form-input">
        <ui-datalist
          id="states"
          v-model:value="stateSearch"
          v-model:code="stateCode"
          autocomplete="address-level1"
          :options="states"
          label="State"
          name="state"
          :errors="errors['state']"
          tabindex="6"
          @blur="validate('state')"
          @keyup="hasError('state') && validate('state')"
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
          @blur="validate('email')"
          @keyup="hasError('email') && validate('email')"
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
          @blur="validate('username')"
          @keyup="hasError('username') && validate('username')"
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
          @blur="validate('password')"
          @keyup="hasError('password') && validate('password')"
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
          @blur="validate('confirmPassword')"
          @keyup="hasError('confirmPassword') && validate('confirmPassword')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Register"
          :disabled="!isDirty || hasErrors || loading"
          tabindex="11"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from "vue";
import { object, string, ref as yupRef } from "yup";

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

    const state = reactive({
      city: "",
      confirmPassword: "",
      countryCode: "",
      countrySearch: "",
      email: "",
      errors: {},
      firstName: "",
      hasErrors: computed(() =>
        Object.keys(state.errors).some((e) => !!state.errors[e])
      ),
      isDirty: computed(() => !!state.countryCode),
      lastName: "",
      loading: false,
      message: "",
      password: "",
      stateSearch: "",
      stateCode: "",
      title: "",
      username: "",
    });

    const registerFormSchema = object({
      city: string().max(100, "City is too long (${max} characters allowed)"),
      confirmPassword: string()
        .required("Confirm Password is required")
        .oneOf([yupRef("password")], "Passwords must match"),
      country: string().required("Country is required"),
      email: string()
        .required("Email is required")
        .email("Valid email is required"),
      firstName: string().required("First Name is required"),
      lastName: string().required("Last Name is required"),
      password: string() /* Add rules for password complexity */
        .required("Password is required")
        .matches(
          /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/,
          "Password must be 8 or more characters long and include upper, lower, numeric and special @$!%*#?& characters"
        ),
      state: string().required("State is required"),
      title: string().max(10, "Title too long (${max} characters allowed)"),
      username: string()
        .required("Username is required")
        .min(6, "Username is too short (${min} characters minimum)")
        .max(20, "Username is too long (${max} characters allowed)"),
    });

    function validate(field) {
      registerFormSchema
        .validateAt(field, {
          city: state.city,
          confirmPassword: state.confirmPassword,
          country: state.countryCode,
          email: state.email,
          firstName: state.firstName,
          lastName: state.lastName,
          password: state.password,
          state: state.stateCode,
          title: state.title,
          username: state.username,
        })
        .then(() => {
          state.errors[field] = "";
        })
        .catch((err) => {
          state.errors[field] = err.errors;
        });
    }

    const hasError = (field) => field in state.errors && !!state.errors[field];

    return {
      countries,
      hasError,
      states,
      titles,
      validate,
      ...toRefs(state),
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style lang="scss" scoped></style>
