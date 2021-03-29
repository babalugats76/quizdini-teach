<template>
  <div>
    <input
      :disabled="loading"
      type="button"
      :value="loading ? 'loading...' : 'Refresh'"
      @click.prevent="refreshStats()"
    />
    <h1>Match Stats</h1>
    <h1><label>Match Id</label>{{ matchId }}</h1>
    <pre><label>Stats</label>{{ JSON.stringify(stats, null, 4) }}</pre>
    <h1><label>Error</label>{{ error }}</h1>
    <h1><label>Failed</label>{{ failed }}</h1>
    <h1><label>Initialized</label>{{ initialized }}</h1>
    <h1><label>Loaded</label>{{ loaded }}</h1>
    <h1><label>Loading</label>{{ loading }}</h1>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getMatchStats } from "@/api/matches";
import useLoader from "@/compose/useLoader";

export default {
  name: "MatchStats",
  setup() {
    const refresh = ref(0);
    const route = useRoute();
    const { id: matchId = undefined } = route.params;

    // flip toggle bit (used as loader dependency)
    const refreshStats = () => (refresh.value = refresh.value ^ 1);

    const { data: stats, error, failed, initialized, loaded, loading } = useLoader({
      callback: () => getMatchStats(matchId),
      immediate: true,
      deps: [() => refresh.value],
    });

    return {
      stats,
      error,
      failed,
      initialized,
      loaded,
      loading,
      matchId,
      refresh,
      refreshStats,
    };
  },
};
</script>

<style lang="scss" scoped></style>
