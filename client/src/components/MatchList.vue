<template>
  <h1>
    <strong>{{ matchCount }} matches</strong>
  </h1>
  <pre>
      {{ JSON.stringify(matches, null, 4) }}
  </pre>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import { MATCHES } from "@/store/types";

export default {
  setup() {
    const store = useStore();
    const fetchMatches = () => store.dispatch(`matches/${MATCHES.FETCH}`);
    const matches = computed(() => store.getters["matches/all"]);
    const matchCount = computed(() => store.getters["matches/count"]);

    onMounted(() => {
      fetchMatches();
    });

    return {
      matches,
      matchCount,
    };
  },
};
</script>

<style lang="scss" scoped></style>
