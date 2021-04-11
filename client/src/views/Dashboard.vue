<template>
  <layout-default>
    <h1 v-if="flashMessage">{{ flashMessage }}</h1>
    <h1>Welcome to the Dashboard</h1>
    <h1>
      <strong>{{ matchCount }} matches</strong>
    </h1>
    <match-view :matches="matches" :credits="credits" />
  </layout-default>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { AUTH } from "@vuex/types";
import { useMatches } from "@hooks";
import { MatchView } from "@components";

export default {
  name: "Dashboard",
  components: {
    MatchView,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const { message: flashMessage } = route.params;
    const fetchAuth = () => store.dispatch(`auth/${AUTH.FETCH}`);
    const credits = computed(() => store.getters["auth/credits"]);

    const { matches, count: matchCount } = useMatches();

    onMounted(() => {
      fetchAuth();
    });

    return {
      credits,
      matches,
      matchCount,
      flashMessage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
