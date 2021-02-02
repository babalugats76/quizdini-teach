<template>
  <div id="auth">
    <button @click="fetchAuth()">Fetch Auth</button><br />
    Count: {{ count }} <br />
    Has Data: {{ hasData }} <br />
    Initialized: {{ initialized }} <br />
    Loading: {{ loading }}<br />
    Reloading: {{ reloading }} <br />
    In Error: {{ inError }} <br />
    <pre
      v-show="auth"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(auth, null, 4) }}</pre
    >
    <pre v-show="inError">There was an error!</pre>
    <pre v-show="hasData">There were {{ count }} records found!</pre>
    <pre v-show="reloading">reloading...</pre>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    return {
      fetchAuth: () => store.dispatch("auth/fetch"),
      count: computed(() => store.getters["auth/count"]),
      auth: computed(() => store.getters["auth/all"]),
      hasData: computed(() => store.getters["auth/hasData"]),
      loading: computed(() => store.getters["auth/loading"]),
      inError: computed(() => store.getters["auth/inError"]),
      initialized: computed(() => store.getters["auth/initialized"]),
      reloading: computed(() => store.getters["auth/reloading"]),
    };
  },
};
</script>

<style lang="scss" scoped></style>
