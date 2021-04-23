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
    </template>
  </ui-form>
</template>

<script>
import { reactive } from "vue";
import { object, string } from "yup";
import { UiForm, UiInput } from "@ui";

export default {
  name: "LostForm",
  components: {
    UiForm,
    UiInput,
  },
  setup() {
    const lostFormSchema = object({
      email: string().required("Email is required").email("Invalid email"),
    });
    const initialValues = reactive({ email: "" });
    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      //   if (errors) return;
      //   setSubmitting();
      //   postAccount(values)
      //     .then((res) => {
      //       const { error, data } = res || {};
      //       if (error) {
      //         switch (data.code) {
      //           case "DuplicateUsername":
      //             values.username = "";
      //             message.value = "Username already taken";
      //             severity.value = "danger";
      //             break;
      //           case "DuplicateEmail":
      //             values.email = "";
      //             break;
      //           default:
      //             break;
      //         }
      //         throw new Error("RegistrationFailed");
      //       }
      //       return data.message;
      //     })
      //     .then((message) => router.push({ name: "Login", params: { message } }))
      //     .catch((err) => {
      //       console.error(err);
      //     })
      //     .finally(() => {
      //       setSubmitted();
      //     });
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
