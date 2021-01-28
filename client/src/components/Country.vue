<template>
  <div id="country">
    <button @click="fetchCountries()">Fetch Countries</button><br />
    Count: {{ count }} <br />
    Initialized: {{ initialized }} <br />
    Loading: {{ loading }}<br />
    Loaded: {{ loaded }}<br />
    In Error: {{ inError }} <br />
    <pre
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(countries, null, 4) }}</pre
    >
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore, mapActions } from "vuex";
export default {
  name: "Country",
  setup() {
    const store = useStore();
    return {
      count: computed(() => store.getters["countries/count"]),
      countries: computed(() => store.getters["countries/getAll"]),
      initialized: computed(() => store.getters["countries/initialized"]),
      inError: computed(() => store.getters["countries/inError"]),
      loaded: computed(() => store.getters["countries/loaded"]),
      loading: computed(() => store.getters["countries/loading"]),
      ...mapActions("countries", {
        fetchCountries: "fetch",
      }),
    };
  },
};
</script>

<style lang="scss" scoped></style>
