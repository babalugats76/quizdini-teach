<template>
  <ui-form
    :initial-values="initialValues"
    :schema="registerFormSchema"
    tag="div"
    @submit="handleSubmit"
  >
    <template
      #default="{
        blur,
        dirty,
        errors,
        handleSubmit,
        hasErrors,
        input,
        submitting,
        touched,
        values,
      }"
    >
      <!-- <h1>Yo</h1>
      <div>{{ values.firstName }}</div>
      <div>{{ values.lastName }}</div>
      <label>Dirty</label>
      <pre> {{ dirty }} </pre>
      <label>Submitting</label>
      <pre> {{ submitting }} </pre>
      <label>Touched</label>
      <pre> {{ JSON.stringify(touched, null, 4) }} </pre>
      <label>Errors</label>
      <pre> {{ JSON.stringify(errors, null, 4) }} </pre>
      <label>Has Errors</label>
      <pre> {{ hasErrors }}</pre> -->
      <ui-message
        v-if="message && !submitting && !dirty"
        v-bind="{ [`${severity}`]: true }"
        >{{ message }}</ui-message
      >
      <form>
        <div class="form-input">
          <ui-datalist
            id="title"
            v-model:value="values.title"
            autofocus
            autocomplete="honorific-prefix"
            :options="titles"
            label="Title"
            name="title"
            :errors="touched.title && errors.title"
            tabindex="1"
            maxlength="10"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.firstName"
            name="first-name"
            autocomplete="given-name"
            :errors="touched.firstName && errors.firstName"
            label="First Name"
            tabindex="2"
            type="text"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.lastName"
            autocomplete="family-name"
            :errors="touched.lastName && errors.lastName"
            label="Last Name"
            name="last-name"
            type="text"
            tabindex="3"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.city"
            autocomplete="address-level2"
            :errors="touched.city && errors.city"
            label="City"
            name="city"
            type="text"
            tabindex="4"
            maxlength="100"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-datalist
            id="countries"
            v-model:value="values.country"
            v-model:code="values.countryCode"
            autocomplete="country-name"
            :options="countries"
            label="Country"
            name="country"
            :errors="touched.country && errors.country"
            tabindex="5"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div v-show="values.countryCode === 'US'" class="form-input">
          <ui-datalist
            id="states"
            v-model:value="values.state"
            v-model:code="values.stateCode"
            autocomplete="address-level1"
            :options="states"
            label="State"
            name="state"
            :errors="touched.state && errors.state"
            tabindex="6"
            :disabled="submitting"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.email"
            autocomplete="email"
            :errors="touched.email && errors.email"
            label="Email"
            name="email"
            type="email"
            tabindex="7"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.username"
            autocomplete="username"
            :errors="touched.username && errors.username"
            label="Username"
            name="username"
            type="text"
            tabindex="8"
            maxlength="20"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.password"
            autocomplete="new-password"
            :errors="touched.password && errors.password"
            label="Password"
            name="password"
            type="password"
            tabindex="9"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.confirmPassword"
            autocomplete="new-password"
            :errors="touched.confirmPassword && errors.confirmPassword"
            label="Confirm Password"
            name="confirm-password"
            type="password"
            tabindex="10"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            name="test-submit"
            :disabled="submitting || hasErrors || !dirty"
            type="button"
            value="submit"
            @mousedown.prevent="() => false"
            @click.prevent="handleSubmit"
          />
        </div>
      </form>
    </template>
  </ui-form>
</template>

<script>
import { /* h, inject,*/ reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { object, string, ref as yupRef } from "yup";

import { postAccount } from "@/api/account";

import UiDatalist from "@/components/ui/UiDatalist";
import UiForm from "@/components/ui/UiForm";
import UiInput from "@/components/ui/UiInput";
import UiMessage from "@/components/ui/UiMessage";

import useCountries from "@/compose/useCountries";
import useStates from "@/compose/useStates";

export default {
  name: "TestForm",
  components: {
    UiDatalist,
    UiForm,
    UiInput,
    UiMessage,
  },
  setup() {
    const message = ref("");
    const severity = ref("");

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

    const handleSubmit = async ({
      errors,
      setSubmitting,
      setSubmitted,
      values,
    }) => {
      if (errors) return;
      setSubmitting();
      postAccount(values)
        .then((res) => {
          const { error, data } = res || {};
          if (error) {
            switch (data.code) {
              case "DuplicateUsername":
                values.username = "";
                message.value = "Username already taken";
                severity.value = "danger";
                break;
              case "DuplicateEmail":
                values.email = "";
                break;
              default:
                break;
            }
            throw new Error("RegistrationFailed");
          }
        })
        .then((message) => router.push({ name: "Login", params: { message } }))
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSubmitted();
        });
    };

    return {
      countries,
      handleSubmit,
      initialValues,
      message,
      registerFormSchema,
      severity,
      states,
      titles,
    };
  },
};
</script>

<style lang="scss" scoped></style>
