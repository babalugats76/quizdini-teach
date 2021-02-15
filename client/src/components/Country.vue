<template>
  <div id="country">
    <!-- Visibility: {{ visibility }} <br />
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
    <pre v-show="loaded">
       There were {{ filteredCountries.length }} records found!</pre
    >
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
    <h1 :style="{ fontWeight: 'bold' }">{{ selectedCountry }}</h1>
    <input
      v-model="countrySearch"
      list="countries"
      @input="selectedCountry = getCountryCode($event)"
    />
    <datalist id="countries">
      <option
        v-for="option in lookupByName"
        :key="option.key"
        :data-value="option.value"
      >
        {{ option.text }}
      </option>
    </datalist> -->
    <form class="register-form">
      <ui-datalist
        id="countries"
        v-model:value="countrySearch"
        :options="countries"
        label="Country"
        name="country"
        @input="onCountryChange($event)"
      />
      <span>{{ countryCode }}</span>
    </form>
  </div>
</template>

<script>
import { computed, onMounted, reactive, /* ref, */ toRefs } from "vue";
import { useStore } from "vuex";
import { object, string } from "yup";

import { COUNTRIES } from "@/store/types";
import UiDatalist from "@/components/ui/UiDatalist";

/*eslint-disable-next-line*/
// const filters = {
//   all: (countries) => countries,
//   merica: (countries) => countries.filter((c) => c.value === "US"),
//   lookupByCode: (countries, countryCode) =>
//     countries.filter((c) => c.value === countryCode),
//   lookupByName: function (countries, countryName) {
//     const regex = new RegExp(`${countryName}`, "gis");
//     return countries.filter((c) => regex.test(c.text));
//   },
// };

export default {
  name: "Country",
  components: { UiDatalist },
  setup() {
    // const visibility = ref("lookupByName");
    // const countryCode = ref("");
    // const countryName = ref("");
    // const countrySearch = ref("");
    // const selectedCountry = ref("");
    const store = useStore();

    const state = reactive({
      countries: computed(() => store.getters["countries/options"]),
      countryCode: "",
      countrySearch: "",
      loading: false,
      isDirty: computed(() => !!(state.username && state.password)),
      errors: {},
      hasErrors: computed(() =>
        Object.keys(state.errors).some((e) => !!state.errors[e])
      ),
      message: "",
    });

    const fetchCountries = () => store.dispatch(`countries/${COUNTRIES.FETCH}`);
    // const countries = computed(() => store.getters["countries/options"]);

    const registerFormSchema = object({
      countryCode: string().required(),
    });

    function validate(field) {
      registerFormSchema
        .validateAt(field, {
          countryCode: state.countryCode,
        })
        .then(() => {
          state.errors[field] = "";
        })
        .catch((err) => {
          state.errors[field] = err.errors;
        });
    }

    // const filteredCountries = computed(() =>
    //   filters[visibility.value](countries.value)
    // );
    // const lookupByCode = computed(() =>
    //   filters[visibility.value](countries.value, countryCode.value)
    // );

    // const lookupByName = computed(() =>
    //   filters[visibility.value](countries.value, countryName.value)
    // );

    onMounted(() => {
      fetchCountries();
    });

    const onCountryChange = (evt) => {
      const match = Array.from(evt.target.list.options).find(
        (o) => o.innerHTML === evt.target.value
      );
      state.countryCode = match ? match.dataset["value"] : null;
      validate("countryCode");
    };

    return {
      // fetchCountries,
      // filteredCountries,
      // lookupByCode,
      // lookupByName,
      // loaded: computed(() => store.getters["countries/loaded"]),
      // failed: computed(() => store.getters["countries/failed"]),
      // loading: computed(() => store.getters["countries/loading"]),
      // visibility,
      // countryCode,
      // countryName,
      // countrySearch,
      // selectedCountry,
      // countries,
      onCountryChange,
      ...toRefs(state),
    };
  },
  methods: {
    getCountryCode: (e) => {
      const match = Array.from(e.target.list.options).find(
        (o) => o.innerHTML === e.target.value
      );
      if (!match) return;
      return match.dataset["value"];
    },
  },
};
</script>

<style lang="scss" scoped></style>
