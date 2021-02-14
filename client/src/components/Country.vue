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
    <button @click="visibility = 'lookupByCode'">Search By Code</button><br />
    <pre
      v-show="visibility === 'lookupByCode'"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(lookupByCode, null, 4) }}</pre
    >
    <input v-model="countryName" type="text" />
    <button @click="visibility = 'lookupByName'">Search By Name</button><br />
    <pre
      v-show="visibility === 'lookupByName'"
      :style="{ fontSize: '10px', maxHeight: '200px', overflow: 'scroll' }"
      >{{ JSON.stringify(lookupByName, null, 4) }}</pre
    >
    <select v-model="selectedCountry">
      <option disabled value="">Please select one</option>
      <option
        v-for="option in lookupByName"
        :key="option.key"
        :value="option.key"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { COUNTRIES } from "@/store/types";

/*eslint-disable-next-line*/
const filters = {
  all: (countries) => countries,
  merica: (countries) => countries.filter((c) => c.value === "US"),
  lookupByCode: (countries, countryCode) =>
    countries.filter((c) => c.value === countryCode),
  lookupByName: function (countries, countryName) {
    const regex = new RegExp(`${countryName}`, "gis");
    return countries.filter((c) => regex.test(c.text));
  },
};

export default {
  name: "Country",
  setup() {
    const visibility = ref("lookupByName");
    const countryCode = ref("");
    const countryName = ref("");
    const selectedCountry = ref("");
    const store = useStore();

    const fetchCountries = () => store.dispatch(`countries/${COUNTRIES.FETCH}`);
    const countries = computed(() => store.getters["countries/options"]);

    const filteredCountries = computed(() =>
      filters[visibility.value](countries.value)
    );
    const lookupByCode = computed(() =>
      filters[visibility.value](countries.value, countryCode.value)
    );

    const lookupByName = computed(() =>
      filters[visibility.value](countries.value, countryName.value)
    );

    onMounted(() => {
      fetchCountries();
    });

    return {
      fetchCountries,
      filteredCountries,
      lookupByCode,
      lookupByName,
      loaded: computed(() => store.getters["countries/loaded"]),
      failed: computed(() => store.getters["countries/failed"]),
      loading: computed(() => store.getters["countries/loading"]),
      visibility,
      countryCode,
      countryName,
      selectedCountry,
    };
  },
};
</script>

<style lang="scss" scoped></style>
