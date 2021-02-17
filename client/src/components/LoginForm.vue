<template>
  <div class="login">
    <div class="login__google-signin google-signin">
      <div
        class="google-signin__btn"
        @click="popup('/auth/google', 'google_login', 500, 500)"
      >
        <span class="google-signin__icon" />
        <span class="google-signin__text">Login with Google</span>
      </div>
    </div>
    <form class="login__form" @submit.prevent="loginUser">
      <div v-if="errors && !isDirty && message">{{ message }}</div>
      <div class="form-input">
        <ui-input
          v-model:value="username"
          :errors="errors['username']"
          label="Username"
          name="username"
          type="text"
          tabindex="1"
          @input="validate('username')"
        />
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="password"
          :errors="errors['password']"
          label="Password"
          name="password"
          type="password"
          tabindex="2"
          @input="validate('password')"
        />
      </div>
      <div class="form-input">
        <input
          type="submit"
          value="Login"
          :disabled="!isDirty || hasErrors || loading"
          tabindex="3"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { object, string } from "yup";
import { computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { postLogin } from "@/api/auth";

import UiInput from "@/components/ui/UiInput";

import { AUTH } from "@/store/types";

export default {
  name: "LoginForm",
  components: {
    UiInput,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      username: "",
      password: "",
      loading: false,
      isDirty: computed(() => !!(state.username && state.password)),
      errors: {},
      hasErrors: computed(() =>
        Object.keys(state.errors).some((e) => !!state.errors[e])
      ),
      message: "",
    });

    const loginFormSchema = object({
      username: string().required(),
      password: string().required(),
    });

    function validate(field) {
      loginFormSchema
        .validateAt(field, {
          username: state.username,
          password: state.password,
        })
        .then(() => {
          state.errors[field] = "";
        })
        .catch((err) => {
          state.errors[field] = err.errors;
        });
    }

    function loginUser() {
      loginFormSchema
        .validate(
          {
            username: state.username,
            password: state.password,
          },
          { abortEarly: false }
        )
        .then(() => {
          state.loading = true;
          return postLogin({
            username: state.username,
            password: state.password,
          })
            .then((res) => {
              const { error, data } = res || {};
              if (error) {
                state.errors = {};
                state.loading = false;
                state.password = "";
                state.username = "";
                state.message = data.message;
                throw new Error("LoginFailed");
              }
            })
            .then(() => store.dispatch(`auth/${AUTH.FETCH}`))
            .then(() => router.push({ name: "dashboard" }))
            .catch(() => {});
        })
        .catch((err) => {
          err.inner.forEach((e) => {
            state.errors[e.path] = e.errors;
          });
        });
    }

    const popup = (url, name, width, height, win = window) => {
      const y = win.top.outerHeight / 2 + win.top.screenY - height / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - width / 2;
      const specs = `rel=opener, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`;
      win.open(url, name, specs);
    };

    return {
      loginUser,
      popup,
      validate,
      ...toRefs(state),
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
    background: url("~@/assets/images/g-normal.png") transparent 5px 50%
      no-repeat;
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
