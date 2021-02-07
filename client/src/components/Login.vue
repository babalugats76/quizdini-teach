<template>
  <div class="login">
    <div class="login__google-signin google-signin">
      <div
        class="google-signin__btn"
        @click="popup('/auth/google', 'google_login', 500, 500)"
      >
        <span class="google-signin__icon"></span>
        <span class="google-signin__text">Login with Google</span>
      </div>
    </div>
    <label>Logged In</label> {{ loggedIn }}<br />
    <a href="/logout">Logout</a>
    {{ error && !isDirty ? error : "" }}
    <div class="form-input">
      <label>Username:</label
      ><input type="text" name="username" v-model="username" />
    </div>
    <div class="form-input">
      <label>Password:</label
      ><input type="password" name="password" v-model="password" />
    </div>
    <button
      @click.prevent="toggleLogin ^= true"
      :disabled="loading || !isDirty"
    >
      {{ loading ? "Loading..." : "Login" }}
    </button>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { postLogin } from "@/api/auth";
import useLoader from "@/compose/useLoader";

//import { FETCH_AUTH } from "@/store/mutation-types";

export default {
  name: "login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const loggedIn = computed(() => store.getters["auth/loggedIn"]);

    const username = ref("");
    const password = ref("");
    const toggleLogin = ref(0);

    const isDirty = computed(() => !!(username.value || password.value));

    const popup = (url, name, width, height, win = window) => {
      const y = win.top.outerHeight / 2 + win.top.screenY - height / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - width / 2;
      const specs = `rel=opener, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`;
      win.open(url, name, specs);
    };

    const { data: results, error, failed, loading, loaded } = useLoader({
      callback: async () => {
        const results = await postLogin({
          username: username.value,
          password: password.value,
        });
        username.value = "";
        password.value = "";
        return results;
      },
      immediate: false,
      deps: [toggleLogin],
    });

    watch(loaded, () => loaded && store.dispatch("auth/fetch"));
    store.watch(
      (state) => state.auth.data.loggedIn,
      () => {
        console.log("state watcher fired!");
        router.push({ name: "dashboard" });
      }
    );

    return {
      results,
      error,
      failed,
      loaded,
      loading,
      username,
      password,
      toggleLogin,
      isDirty,
      loggedIn,
      popup,
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
