<template>
  <ul v-if="matches.length">
    <li v-for="m in matches" :key="m.matchId">
      {{ m.title }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "MatchList",
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
