<template>
  <ui-form
    class="lost__form"
    :initial-values="initialValues"
    :schema="lostFormSchema"
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
          v-model:value="values.email"
          autocomplete="email"
          :errors="touched.email && errors.email"
          label="Email"
          name="email"
          type="email"
          tabindex="1"
          :disabled="submitting"
          @blur="blur"
          @input="input"
        />
      </div>
      <div class="form-input">
        <ui-input
          name="lostSubmit"
          tabindex="2"
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
import { object, string } from "yup";
import { sendRecoveryEmail } from "@api";
import { UiForm, UiInput } from "@ui";

export default {
  name: "LostForm",
  components: {
    UiForm,
    UiInput,
  },
  props: {
    recoveryType: {
      type: String,
      default: "username",
    },
  },
  setup(props) {
    const router = useRouter();
    const lostFormSchema = object({
      email: string().required("Email is required").email("Invalid email"),
    });
    const initialValues = reactive({ email: "" });
    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
      setSubmitting();
      sendRecoveryEmail({ ...values, recoveryType: props.recoveryType })
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
      lostFormSchema,
    };
  },
};
</script>

<style lang="scss" scoped></style>
