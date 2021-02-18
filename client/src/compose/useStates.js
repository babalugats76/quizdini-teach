import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { STATES } from "@/store/types";

export default function useStates() {
  const store = useStore();
  const fetchStates = () => store.dispatch(`states/${STATES.FETCH}`);

  const states = computed(() => store.getters["states/options"]); // computed for dropdowns

  const error = computed(() => store.getters["states/error"]);
  const failed = computed(() => store.getters["states/failed"]);
  const loaded = computed(() => store.getters["states/loaded"]);
  const loading = computed(() => store.getters["states/loading"]);

  onMounted(() => {
    if (!loaded.value) fetchStates(); // load once (cached in Vuex store)
  });

  return {
    states,
    error,
    failed,
    loaded,
    loading,
  };
}
