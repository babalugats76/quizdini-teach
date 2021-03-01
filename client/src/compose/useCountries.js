import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { COUNTRIES } from "@/store/types";

export default function useCountries() {
  const store = useStore();
  const fetchCountries = () => store.dispatch(`countries/${COUNTRIES.FETCH}`);

  const options = computed(() => store.getters["countries/options"]); // computed for dropdowns
  const countries = computed(() => store.getters["countries/all"]); // computed for filters, etc.

  const error = computed(() => store.getters["countries/error"]);
  const failed = computed(() => store.getters["countries/failed"]);
  const loaded = computed(() => store.getters["countries/loaded"]);
  const loading = computed(() => store.getters["countries/loading"]);

  onMounted(() => {
    if (!loaded.value && !loading.value) fetchCountries(); // load once (cached in Vuex store)
  });

  return {
    countries,
    options,
    error,
    failed,
    loaded,
    loading,
  };
}
