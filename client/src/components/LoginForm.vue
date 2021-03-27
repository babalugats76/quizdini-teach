<template>
  <div class="login">
    <h1 :v-if="flashMessage">{{ flashMessage }}</h1>
    <div class="login__google-signin google-signin">
      <div class="google-signin__btn" @click="popup('/auth/google', 'google_login', 500, 500)">
        <span class="google-signin__icon" />
        <span class="google-signin__text">Login with Google</span>
      </div>
    </div>
    <ui-form
      class="login__form"
      :initial-values="initialValues"
      :schema="loginFormSchema"
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
        <ui-message v-if="message && !submitting && !dirty" v-bind="{ [`${severity}`]: true }">
          {{ message }}
        </ui-message>
        <div class="form-input">
          <ui-input
            v-model:value="values.username"
            :errors="touched.username && errors.username"
            label="Username"
            name="username"
            type="text"
            tabindex="1"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            v-model:value="values.password"
            :errors="touched.password && errors.password"
            label="Password"
            name="password"
            type="password"
            tabindex="2"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-input
            name="login-submit"
            tabindex="3"
            :disabled="submitting || hasErrors || !dirty"
            type="button"
            value="Login"
            @mousedown.prevent="() => false"
            @click.prevent="handleSubmit"
          />
        </div>
      </template>
    </ui-form>
  </div>
</template>

<script>
import { object, string } from "yup";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { postLogin } from "@/api/auth";

import UiForm from "@/components/ui/UiForm";
import UiInput from "@/components/ui/UiInput";
import UiMessage from "@/components/ui/UiMessage";

import { AUTH } from "@/store/types";

export default {
  name: "LoginForm",
  components: {
    UiForm,
    UiInput,
    UiMessage,
  },
  setup() {
    const message = ref("");
    const severity = ref("");

    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { message: flashMessage } = route.params;
    const loginFormSchema = object({
      username: string().required(),
      password: string().required(),
    });

    const initialValues = reactive({
      username: "",
      password: "",
    });

    const handleSubmit = async ({ errors, setSubmitting, setSubmitted, values }) => {
      if (errors) return;
      setSubmitting();
      postLogin(values)
        .then((res) => {
          const { error, data } = res || {};
          if (error) {
            console.log("error", error);
            console.log("data", data);
            values.password = "";
            values.username = "";
            message.value = data.message;
            severity.value = "danger";
            throw new Error("LoginFailed");
          }
          return data.message;
        })
        .then(() => store.dispatch(`auth/${AUTH.FETCH}`))
        .then(() => router.push({ name: "Dashboard" }))
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSubmitted();
        });
    };

    const popup = (url, name, width, height, win = window) => {
      const y = win.top.outerHeight / 2 + win.top.screenY - height / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - width / 2;
      const specs = `rel=opener, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`;
      win.open(url, name, specs);
    };

    return {
      popup,
      handleSubmit,
      initialValues,
      flashMessage,
      message,
      loginFormSchema,
      severity,
    };
  },
};
</script>

<style lang="scss" scoped>
$google-icon-size: "42px";

.login {
  &__google-signin {
    display: block;
  }
}

.google-signin {
  &__btn {
    display: inline-block;
    cursor: pointer;
    background: white;
    color: #444;
    border-radius: 5px;
    border: thin solid #888;
    box-shadow: 1px 1px 1px grey;
    white-space: nowrap;
  }
  &__icon {
    display: inline-block;
    vertical-align: middle;
    background: url("~@/assets/images/g-normal.png") transparent 5px 50% no-repeat;
    width: #{$google-icon-size};
    height: #{$google-icon-size};

    // &:focus,
    // &:hover {
    //   background-image: url("~@/assets/images/btn_google_signin_light_focus_web@2x.png");
    // }
    // &:active,
    // &:visited {
    //   background-image: url("~@/assets/images/btn_google_signin_light_pressed_web@2x.png");
    // }
  }
  &__text {
    display: inline-block;
    vertical-align: middle;
    padding: 0 #{$google-icon-size} 0 1rem;
    @include font("Montserrat", "normal");
    font-size: 1rem;
  }
}
</style>
