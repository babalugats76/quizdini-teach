<template>
  <div id="country">
    Visibility: {{ visibility }} <br />
    <button @click="fetchCountries()">Fetch Countries</button><br />
    <button @click.prevent="visibility = 'merica'">America First!</button><br />
    Total Count: {{ count }} <br />
    Filtered Count: {{ filteredCountries ? filteredCountries.length : null }}
    <br />
    Has Data: {{ hasData }} <br />
    Initialized: {{ initialized }} <br />
    Loading: {{ loading }}<br />
    Reloading: {{ reloading }} <br />
    In Error: {{ inError }} <br />
    <pre
      v-show="filteredCountries"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(filteredCountries, null, 4) }}</pre
    >
    <pre v-show="inError">There was an error!</pre>
    <pre v-show="hasData">There were {{ count }} records found!</pre>
    <pre v-show="reloading">reloading...</pre>
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
    const countries = computed(() => store.state.countries.data);
    const filteredCountries = computed(() =>
      filters[visibility.value](countries.value)
    );
    const lookupCountry = computed(() =>
      filters[visibility.value](countries.value, countryCode.value)
    );

    return {
      fetchCountries: () => store.dispatch("countries/fetch"),
      count: computed(() => store.getters["countries/count"]),
      filteredCountries,
      lookupCountry,
      hasData: computed(() => store.getters["countries/hasData"]),
      inError: computed(() => store.getters["countries/inError"]),
      initialized: computed(() => store.getters["countries/initialized"]),
      loading: computed(() => store.getters["countries/loading"]),
      reloading: computed(() => store.getters["countries/reloading"]),
      visibility,
      countryCode,
    };
  },
};
</script>

<style lang="scss" scoped></style>
