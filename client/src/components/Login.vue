<template>
  <div id="login">
    <div class="form-input">
      <label>Username:</label
      ><input type="text" name="username" v-model="username" />
    </div>
    <div class="form-input">
      <label>Password:</label
      ><input type="password" name="password" v-model="password" />
    </div>
    <button @click.prevent="toggleLogin ^= true" :disabled="loading">
      {{ loading ? "Loading..." : "Login" }}
    </button>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { postLogin } from "@/api/auth";
import useLoader from "@/compose/useLoader";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const toggleLogin = ref(0);

    const store = useStore();

    const { data: results, error, inError, loading, success } = useLoader({
      callback: () =>
        postLogin({
          username: username.value,
          password: password.value,
        }),
      immediate: false,
      deps: [toggleLogin],
    });

    watch(
      success,
      (success, previousSuccess) => {
        console.log("success", success);
        console.log("previousSuccess", previousSuccess);
        store.dispatch("auth/fetch");
      },
      { deep: true }
    );

    return {
      results,
      error,
      inError,
      loading,
      username,
      password,
      toggleLogin,
    };
  },
};
</script>

<style lang="scss" scoped></style>
