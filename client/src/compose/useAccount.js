import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ACCOUNT } from "@/store/types";

export default function useCountries() {
  const store = useStore();
  const fetchAccount = () => store.dispatch(`account/${ACCOUNT.FETCH}`);

  const email = computed(() => store.getters["account/email"]);
  const countryCode = computed(() => store.getters["account/countryCode"]);

  const error = computed(() => store.getters["account/error"]);
  const failed = computed(() => store.getters["account/failed"]);
  const loaded = computed(() => store.getters["account/loaded"]);
  const loading = computed(() => store.getters["account/loading"]);

  onMounted(() => {
    if (!loaded.value && !loading.value) fetchAccount(); // load once (cached in Vuex store)
  });

  return {
    countryCode,
    email,
    error,
    failed,
    loaded,
    loading,
  };
}
