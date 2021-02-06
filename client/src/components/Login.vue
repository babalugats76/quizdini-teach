<template>
  <div class="login">
    <div class="login__oauth google-oauth">
      <ui-link
        class="google-oauth__link"
        href="/auth/google"
        target="_self"
        tabindex="1"
      >
        <span class="google-oauth__icon"></span>
      </ui-link>
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
import { UiLink } from "@/components";

export default {
  name: "login",
  components: {
    UiLink,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const loggedIn = computed(() => store.getters["auth/loggedIn"]);

    const username = ref("");
    const password = ref("");
    const toggleLogin = ref(0);

    const isDirty = computed(() => !!(username.value || password.value));

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
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  &__oauth {
    display: block;
  }
}

.google-oauth {
  &__link {
    display: inline-block;
  }
  &__icon {
    display: inline-block;
    width: 191px;
    height: 46px;
    margin: 0 auto;
    text-decoration: none;
    color: transparent;
    border: 0;
    outline: none;
    background: #ffffff
      url("~@/assets/images/btn_google_signin_light_normal_web@2x.png")
      no-repeat;
    background-size: 191px 46px;
    // &:focus,
    // &:hover {
    //   background-image: url("~@/assets/images/btn_google_signin_light_focus_web@2x.png");
    // }
    // &:active,
    // &:visited {
    //   background-image: url("~@/assets/images/btn_google_signin_light_pressed_web@2x.png");
    // }
  }
}
</style>
