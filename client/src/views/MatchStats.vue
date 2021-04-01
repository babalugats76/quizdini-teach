<template>
  <div class="page-wrapper">
    <!-- <h1><label>Match Id</label>{{ matchId }}</h1>
    <pre><label>Stats</label>{{ JSON.stringify(stats, null, 4) }}</pre>
    <h1><label>Error</label>{{ error }}</h1>
    <h1><label>Failed</label>{{ failed }}</h1>
    <h1><label>Initialized</label>{{ initialized }}</h1>
    <h1><label>Loaded</label>{{ loaded }}</h1>
    <h1><label>Loading</label>{{ loading }}</h1> -->
    <div class="container">
      <input
        :disabled="loading"
        type="button"
        :value="loading ? 'loading...' : 'Refresh'"
        @click.prevent="refreshStats()"
      />
      <h1>Match Stats</h1>
      <grid>
        <grid-row :columns="3">
          <grid-column>
            <ping-chart v-if="!!stats" :create-date="stats.createDate" :pings="stats.pings" />
          </grid-column>
          <grid-column>
            <ping-chart v-if="!!stats" :create-date="stats.createDate" :pings="stats.pings" />
          </grid-column>
          <grid-column>
            <ping-chart v-if="!!stats" :create-date="stats.createDate" :pings="stats.pings" />
          </grid-column>
        </grid-row>
      </grid>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getMatchStats } from "@/api/matches";
import useLoader from "@/compose/useLoader";
import { PingChart } from "@/components/";
import { UiGrid, UiGridRow, UiGridColumn } from "@/components/ui/UiGrid";

export default {
  name: "MatchStats",
  components: {
    PingChart,
    grid: UiGrid,
    "grid-row": UiGridRow,
    "grid-column": UiGridColumn,
  },
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

<style lang="scss" scoped>
.page-wrapper {
  position: relative;
  margin-top: 1rem;
  margin: 0 auto;
  max-width: 960px;
}

.container {
  padding: 1rem;
}
</style>
