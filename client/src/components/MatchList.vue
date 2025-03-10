<template>
  <card-grid v-if="matches.length" type="game">
    <game-card
      v-for="{
        matchId,
        title,
        termCount,
        options: { duration, itemsPerBoard, colorScheme = 'basic' },
      } in matches"
      :key="matchId"
      type="match"
    >
      <template #badge>{{ getBadgeType(colorScheme) }}</template>
      <template #title>{{ title }}</template>
      <template #details>
        <ul>
          <li>Duration: {{ duration }}</li>
          <li>ItemsPerBoard: {{ itemsPerBoard }}</li>
          <li>Term Count: {{ termCount }}</li>
        </ul>
      </template>
      <template #footer>
        <ui-button-group>
          <ui-link :href="getGameUrl(matchId)" :target="`_${matchId}`">
            <ui-button>Play</ui-button>
          </ui-link>
          <!-- <nav-button :to="getEditUri(matchId)">Edit</nav-button> -->
          <ui-button @click.prevent="handleEdit(matchId)">Edit</ui-button>
          <nav-button :to="getStatsUri(matchId)">Stats</nav-button>
          <ui-button @click.prevent="handleCopy(matchId)">Copy</ui-button>
        </ui-button-group>
      </template>
    </game-card>
  </card-grid>
</template>

<script>
import CardGrid from "./CardGrid";
import GameCard from "./GameCard";
import { NavButton, UiButton, UiButtonGroup, UiLink } from "@ui";
import { useClipboard } from "@hooks";

export default {
  name: "MatchList",
  components: {
    CardGrid,
    GameCard,
    NavButton,
    UiButton,
    UiButtonGroup,
    UiLink,
  },
  props: {
    matches: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const { copy: copyToClipboard } = useClipboard();
    const getEditUri = (id) => `/match/${id}`;
    const getGameUrl = (id) => `${process.env.VUE_APP_GAME_BASE_URL}/match/${id}`;
    const getStatsUri = (id) => `/match/${id}/stats`;
    const getBadgeType = (colorScheme) =>
      colorScheme.toLowerCase() != "basic" ? "basic-icon-name" : "rainbow-icon-name";
    const handleCopy = async (id) => {
      await copyToClipboard(getGameUrl(id));
    };

    const handleEdit = (id) => {
      emit("edit", { id });
    };

    return {
      getBadgeType,
      getEditUri,
      getGameUrl,
      getStatsUri,
      handleCopy,
      handleEdit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
