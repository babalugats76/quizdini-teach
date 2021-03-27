<template>
  <div class="login">
    <div class="login__google-signin google-signin">
      <div class="google-signin__btn" @click="popup('/auth/google', 'google_login', 500, 500)">
        <span class="google-signin__icon" />
        <span class="google-signin__text">Login with Google</span>
      </div>
    </div>
    <!-- <label>Logged In</label> {{ loggedIn }}<br /> -->
    <a href="/logout">Logout</a>
    <!-- {{ error && !isDirty ? error : "" }} -->
    <form class="login-form" @submit.prevent="loginUser">
      <div class="form-input">
        <ui-input
          v-model:value="username"
          :errors="errors['username']"
          label="Username"
          name="username"
          type="text"
          @input="validate('username')"
        />
        <pre>Ref Value: {{ username }}</pre>
        <!-- <input v-model="username" type="text" name="username" /> -->
      </div>
      <div class="form-input">
        <ui-input
          v-model:value="password"
          :errors="errors['password']"
          label="Password"
          name="password"
          type="password"
          @input="validate('password')"
        />
        <pre>Ref Value: {{ password }}</pre>
      </div>
      <input type="submit" value="Login" />
      <!-- <button
        :disabled="loading || !isDirty"
        @click.prevent="toggleLogin ^= true"
      >
        {{ loading ? "Loading..." : "Login" }}
      </button> -->
    </form>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import { object, string } from "yup";
// import * as yup from "yup";
import { ref, /*watch,*/ computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
// import { useRouter } from "vue-router";

// import { postLogin } from "@/api/auth";
// import useLoader from "@/compose/useLoader";
import { UiInput } from "@/components/";

//import { FETCH_AUTH } from "@/store/mutation-types";

export default {
  name: "Login",
  components: {
    UiInput,
  },
  setup() {
    const store = useStore();
    // const router = useRouter();
    // const loggedIn = computed(() => store.getters["auth/loggedIn"]);

    const data = reactive({
      errors: {},
    });

    const username = ref("");
    const password = ref("");
    // const toggleLogin = ref(0);

    const loginFormSchema = object({
      username: string().required(),
      password: string().required(),
    });

    const validate = (field) => {
      loginFormSchema
        .validateAt(field, {
          username: username.value,
          password: password.value,
        })
        .then(() => {
          console.log("clearing yup errors for", field);
          data.errors[field] = "";
        })
        .catch((err) => {
          console.log("setting errors for", field);
          data.errors[field] = err.errors;
        });
    };

    const isDirty = computed(() => !!(username.value || password.value));

    const popup = (url, name, width, height, win = window) => {
      const y = win.top.outerHeight / 2 + win.top.screenY - height / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - width / 2;
      const specs = `rel=opener, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`;
      win.open(url, name, specs);
    };

    // const { data: results, error, failed, loading, loaded } = useLoader({
    //   callback: async () => {
    //     const results = await postLogin({
    //       username: username.value,
    //       password: password.value,
    //     });
    //     username.value = "";
    //     password.value = "";
    //     return results;
    //   },
    //   immediate: false,
    //   deps: [toggleLogin],
    // });

    // watch(loaded, () => loaded && store.dispatch("auth/fetch"));
    // store.watch(
    //   (state) => state.auth.data.loggedIn,
    //   () => {
    //     console.log("state watcher fired!");
    //     router.push({ name: "dashboard" });
    //   }
    // );

    function loginUser() {
      console.log("Logging In...");
    }

    return {
      // results,
      // error,
      // failed,
      // loaded,
      // loading,
      username,
      password,
      // toggleLogin,
      isDirty,
      // loggedIn,
      popup,
      loginUser,
      validate,
      ...toRefs(data),
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
