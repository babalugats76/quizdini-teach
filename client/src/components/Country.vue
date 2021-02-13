<template>
  <div id="country">
    Visibility: {{ visibility }} <br />
    <button @click="fetchCountries()">Fetch Countries</button><br />
    <button @click.prevent="visibility = 'all'">All Countries</button><br />
    <button @click.prevent="visibility = 'merica'">America First!</button><br />
    <span v-if="loaded"
      >Filtered Count:
      {{ filteredCountries ? filteredCountries.length : null }}</span
    ><br />
    loaded: {{ loaded }}<br />
    loading: {{ loading }} <br />
    failed: {{ failed }} <br />
    <pre
      v-show="loaded"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(filteredCountries, null, 4) }}</pre
    >
    <pre v-show="failed">There was an error!</pre>
    <!-- <pre v-show="loaded">
       There were {{ filteredCountries.length }} records found!</pre
    > -->
    <input v-model="countryCode" type="text" />
    <button @click="visibility = 'lookup'">Search Countries</button><br />
    <pre
      v-show="visibility === 'lookup'"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(lookupCountry, null, 4) }}</pre
    >
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { COUNTRIES } from "@/store/types";

/*eslint-disable-next-line*/
const filters = {
  all: (countries) => countries,
  merica: (countries) => countries.filter((c) => c.countryCode === "US"),
  lookup: (countries, countryCode) =>
    countries.filter((c) => c.countryCode === countryCode),
};

export default {
  name: "Country",
  setup() {
    const visibility = ref("all");
    const countryCode = ref("");
    const store = useStore();
    const countries = computed(() => store.getters["countries/all"]);

    const filteredCountries = computed(() =>
      filters[visibility.value](countries.value)
    );
    const lookupCountry = computed(() =>
      filters[visibility.value](countries.value, countryCode.value)
    );

    return {
      fetchCountries: () => store.dispatch(`countries/${COUNTRIES.FETCH}`),
      filteredCountries,
      lookupCountry,
      loaded: computed(() => store.getters["countries/loaded"]),
      failed: computed(() => store.getters["countries/failed"]),
      loading: computed(() => store.getters["countries/loading"]),
      visibility,
      countryCode,
    };
  },
};
</script>

<style lang="scss" scoped></style>
