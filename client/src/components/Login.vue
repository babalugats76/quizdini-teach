<template>
  <div id="login">
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
import { postLogin } from "@/api/auth";
import useLoader from "@/compose/useLoader";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const toggleLogin = ref(0);

    const store = useStore();

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

    watch(loaded, () => store.dispatch("auth/fetch"));

    const isDirty = computed(() => !!(username.value || password.value));

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
    };
  },
};
</script>

<style lang="scss" scoped></style>
