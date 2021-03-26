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
        <a :href="`${baseGameUrl}/${matchId}`" target="_blank">{{ title }}</a>
      </template>
    </game-card>
  </card-grid>
</template>

<script>
import CardGrid from "@/components/CardGrid";
import GameCard from "@/components/GameCard";

export default {
  name: "MatchList",
  components: {
    CardGrid,
    GameCard,
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
