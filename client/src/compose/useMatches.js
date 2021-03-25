import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { MATCHES } from "@/store/types";

export default function useMatches() {
  const store = useStore();
  const fetchMatches = () => store.dispatch(`matches/${MATCHES.FETCH}`);

  const count = computed(() => store.getters["matches/count"]);
  const matches = computed(() => store.getters["matches/all"]);

  const error = computed(() => store.getters["matches/error"]);
  const failed = computed(() => store.getters["matches/failed"]);
  const loaded = computed(() => store.getters["matches/loaded"]);
  const loading = computed(() => store.getters["matches/loading"]);

  onMounted(() => fetchMatches());

  return {
    count,
    matches,
    error,
    failed,
    loaded,
    loading,
  };
}
