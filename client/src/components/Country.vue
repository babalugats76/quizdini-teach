<template>
  <div id="country">
    Loading: {{ loading }}
    <button @click="getCountries()">Fetch Countries</button>
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
      loading: computed(() => store.state.countries.loading),
      ...mapActions("countries", ["getCountries"]),
    };
  },
};
</script>

<style lang="scss" scoped></style>
