<template>
  <div id="auth">
    <button @click="fetchAuth()">Fetch Auth</button><br />
    Count: {{ count }} <br />
    Initialized: {{ initialized }} <br />
    Loading: {{ loading }}<br />
    Loaded: {{ loaded }}<br />
    In Error: {{ inError }} <br />
    <pre
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(auth, null, 4) }}</pre
    >
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore, mapActions } from "vuex";
export default {
  setup() {
    const store = useStore();
    return {
      count: computed(() => store.getters["auth/count"]),
      auth: computed(() => store.getters["auth/all"]),
      initialized: computed(() => store.getters["auth/initialized"]),
      inError: computed(() => store.getters["auth/inError"]),
      loaded: computed(() => store.getters["auth/loaded"]),
      loading: computed(() => store.getters["auth/loading"]),
      ...mapActions("auth", ["fetchAuth"]),
    };
  },
};
</script>

<style lang="scss" scoped></style>
