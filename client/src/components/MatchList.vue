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
      <template #badge>{{
        colorScheme.toLowerCase() != "basic"
          ? "basic icon here"
          : "rainbow icon here"
      }}</template>
      <template #title>{{ title }}</template>
      <template #details>
        <ul>
          <li>{{ duration }}</li>
          <li>{{ itemsPerBoard }}</li>
          <li>{{ termCount }}</li>
        </ul>
      </template>
      <template #footer>
        <ui-button-group>
          <ui-link :href="`${baseGameUrl}/${matchId}`" :target="`_${matchId}`">
            <ui-button tag="button">Play</ui-button>
          </ui-link>
          <router-link :to="{ path: `/match/${matchId}/stats` }">
            <ui-button tag="button">Stats</ui-button>
          </router-link>
          <router-link :to="{ path: `/match/${matchId}` }">
            <ui-button tag="button">Edit</ui-button>
          </router-link>
        </ui-button-group>
      </template>
    </game-card>
  </card-grid>
</template>

<script>
import CardGrid from "@/components/CardGrid";
import GameCard from "@/components/GameCard";
import { UiButton, UiButtonGroup } from "@/components/ui/UiButton";
import UiLink from "@/components/ui/UiLink";

export default {
  name: "MatchList",
  components: {
    CardGrid,
    GameCard,
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
  setup() {
    return {
      baseGameUrl: `${process.env.VUE_APP_GAME_BASE_URL}/match`,
    };
  },
};
</script>

<style lang="scss" scoped></style>
