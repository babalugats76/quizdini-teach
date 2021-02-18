<template>
  <div class="register">
    <form class="register__form" @submit.prevent="loginUser">
      <div v-if="errors && !isDirty && message">{{ message }}</div>
      <div class="form-input">
        <ui-datalist
          id="countries"
          v-model:value="countrySearch"
          v-model:code="countryCode"
          autofocus
          :options="countries"
          label="Country"
          name="country"
          :errors="errors['country']"
          tabindex="1"
          @blur="validate('country')"
          @keyup="hasError('country') && validate('country')"
        />
      </div>
      <div class="form-input">
        <ui-datalist
          id="states"
          v-model:value="stateSearch"
          v-model:code="stateCode"
          :options="states"
          label="State"
          name="state"
          :errors="errors['state']"
          tabindex="2"
          @blur="validate('state')"
          @keyup="hasError('state') && validate('state')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Register"
          :disabled="!isDirty || hasErrors || loading"
          tabindex="3"
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
import useStates from "@/compose/useStates";

export default {
  name: "RegisterForm",
  components: { UiDatalist },
  setup() {
    const { countries } = useCountries();
    const { states } = useStates();

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
      stateSearch: "",
      stateCode: "",
    });

    const registerFormSchema = object({
      country: string().required("Valid country is required"),
      state: string().required("Valid state is required"),
    });

    function validate(field) {
      console.log("validating", field);
      registerFormSchema
        .validateAt(field, {
          country: state.countryCode,
          state: state.stateCode,
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
