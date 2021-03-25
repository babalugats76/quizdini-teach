<template>
  <card-grid v-if="matches.length" type="game">
    <game-card v-for="m in matches" :key="m.matchId" type="match">
      <template #title>{{ m.title }}</template>
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
};
</script>

<style lang="scss" scoped></style>
