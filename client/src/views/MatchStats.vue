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
      <div class="ui-grid">
        <div class="ui-grid__row">
          <div class="ui-grid__column">
            <ping-chart v-if="!!stats" :create-date="stats.createDate" :pings="stats.pings" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getMatchStats } from "@/api/matches";
import useLoader from "@/compose/useLoader";
import { PingChart } from "@/components/";

export default {
  name: "MatchStats",
  components: {
    PingChart,
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

.ui-grid {
  $grid: &;
  $row: #{$grid}__row;
  $column: #{$grid}__column;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  align-items: stretch;
  margin: -1rem;

  &__row {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: inherit;
    align-items: stretch;
    width: 100% !important;
    padding: 0;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  &__column {
  }
  @at-root #{$grid} > #{$row} > #{$column} {
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding-left: 1rem;
    padding-right: 1rem;
    &:only-child {
      width: 100%;
    }
  }
}
</style>
