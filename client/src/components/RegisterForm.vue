<template>
  <div class="register">
    <form class="register__form" @submit.prevent="loginUser">
      <div v-if="errors && !isDirty && message">{{ message }}</div>
      <div class="form-input">
        <ui-datalist
          id="countries"
          v-model:value="countrySearch"
          v-model:code="countryCode"
          :options="countries"
          label="Country"
          name="country"
          :errors="errors['country']"
          tabindex="1"
          @blur="validate('country')"
          @input="errors['country'] && validate('country')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Register"
          :disabled="!isDirty || hasErrors || loading"
          tabindex="2"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from "vue";
import { object, string } from "yup";

import UiDatalist from "@/components/ui/UiDatalist";
import useCountries from "@/compose/useCountries";

export default {
  name: "RegisterForm",
  components: { UiDatalist },
  setup() {
    const { countries } = useCountries();

    const state = reactive({
      countryCode: "",
      countrySearch: "",
      errors: {},
      hasErrors: computed(() =>
        Object.keys(state.errors).some((e) => !!state.errors[e])
      ),
      isDirty: computed(() => !!state.countryCode),
      loading: false,
      message: "",
    });

    const registerFormSchema = object({
      country: string().required("Valid country is required"),
    });

    function validate(field) {
      registerFormSchema
        .validateAt(field, {
          country: state.countryCode,
        })
        .then(() => {
          state.errors[field] = "";
        })
        .catch((err) => {
          state.errors[field] = err.errors;
        });
    }

    return {
      countries,
      validate,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped></style>
