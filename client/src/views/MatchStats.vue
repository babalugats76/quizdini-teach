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
      <grid v-if="!!stats">
        <grid-row stackable :mobile="3">
          <grid-column>
            <game-stat class="match-stats__plays">
              <template #header>Plays</template>
              <template #stat>{{ stats.totals.plays }}</template>
              <template #label>All Time Plays</template>
            </game-stat>
          </grid-column>
          <grid-column>
            <game-stat class="match-stats__hit-rate">
              <template #header>Hit Rate</template>
              <template #stat>{{ stats.totals.avgHitRate }}%</template>
              <template #label>All Time Hit Rate</template>
            </game-stat>
          </grid-column>
          <grid-column>
            <game-stat class="match-stats__score">
              <template #header>Score</template>
              <template #stat>{{ stats.totals.avgScore }}</template>
              <template #label>All Time Score (Avg)</template>
            </game-stat></grid-column
          >
        </grid-row>
        <grid-row>
          <grid-column>
            <div class="match-stats__options">
              <ui-dropdown
                v-model:value="pingDays"
                :options="[
                  { key: 0, value: 7, text: '7' },
                  { key: 1, value: 14, text: '14' },
                  { key: 2, value: 30, text: '30' },
                ]"
                name="pingDays"
                class="match-stats__ping-days"
                label="Days"
              />
            </div>
            <ping-chart
              class="match-stats__daily-activity"
              :create-date="stats.createDate"
              :days="pingDays"
              :pings="stats.pings"
            />
          </grid-column>
        </grid-row>
      </grid>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { getMatchStats } from "@api";
import { useLoader } from "@hooks";
import { PingChart, GameStat } from "@components";
import { UiDropdown, UiGrid, UiGridRow, UiGridColumn } from "@ui";

export default {
  /* eslint-disable vue/no-unused-components */
  name: "MatchStats",
  components: {
    UiDropdown,
    grid: UiGrid,
    "grid-row": UiGridRow,
    "grid-column": UiGridColumn,
    PingChart,
    GameStat,
  },
  setup() {
    const refresh = ref(0);
    const pingDays = ref(7);
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
      error,
      failed,
      initialized,
      loaded,
      loading,
      pingDays,
      matchId,
      refresh,
      refreshStats,
      stats,
    };
  },
};
</script>

<style lang="scss">
.page-wrapper {
  position: relative;
  margin-top: 1rem;
  margin: 0 auto;
  max-width: 960px;
}

.container {
  padding: 1rem;
}

.match-stats {
  &__options {
    position: absolute;
    top: 0rem;
    right: 1rem;
    > label {
      display: block;
    }
  }
}
</style>
