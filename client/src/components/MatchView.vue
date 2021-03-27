<template>
  <div class="matches">
    <nav-button :to="{ path: `/match/new` }" :disabled="credits <= 0"
      >Press Me</nav-button
    >
    <match-list :matches="matches" class="matches__list" />
  </div>
</template>

<script>
import NavButton from "@/components/ui/NavButton";
import MatchList from "@/components/MatchList";

export default {
  name: "MatchView",
  components: {
    MatchList,
    NavButton,
  },
  props: {
    credits: {
      type: Number,
      required: true,
      default: 0,
    },
    matches: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
