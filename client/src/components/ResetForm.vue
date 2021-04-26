<template>
  <ui-form
    class="reset__form"
    :initial-values="initialValues"
    :schema="resetFormSchema"
    tag="form"
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
      <div class="form-input">
        <ui-input
          v-model:value="values.newPassword"
          autocomplete="new-password"
          :errors="touched.newPassword && errors.newPassword"
          label="New Password"
          name="nwePassword"
          type="password"
          tabindex="1"
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
          name="confirmPassword"
          type="password"
          tabindex="2"
          :disabled="submitting"
          @blur="blur"
          @input="input"
        />
      </div>
      <div class="form-input">
        <ui-input
          name="resetSubmit"
          tabindex="3"
          :disabled="submitting || hasErrors || !dirty"
          type="button"
          value="submit"
          @mousedown.prevent="() => false"
          @click.prevent="handleSubmit"
        />
      </div>
    </template>
  </ui-form>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { object, string, ref as yupRef } from "yup";
import { resetPassword } from "@api";
import { UiForm, UiInput } from "@ui";
export default {
  name: "ResetForm",
  components: {
    UiForm,
    UiInput,
  },
  setup() {
    const router = useRouter();
    const resetFormSchema = object({
      confirmPassword: string().oneOf([yupRef("newPassword")], "Passwords mismatch"),
      newPassword: string() /* Add rules for password complexity */
        .required("Password is required")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$/,
          "Password must be 8 or more characters long and include upper, lower, numeric and special @$!%*#?& characters"
        ),
    });
    const initialValues = reactive({ confirmPassword: "", newPassword: "" });
    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
      setSubmitting();
      resetPassword({ ...values })
        .then((res) => {
          const { data: { message } = {} } = res || {};
          return message;
        })
        .then((message) => router.push({ name: "Login", params: { message } }))
        .catch((err) => console.error(err))
        .finally(() => setSubmitted());
    };
    return {
      handleSubmit,
      initialValues,
      resetFormSchema,
    };
  },
};
</script>

<style lang="scss" scoped></style>
