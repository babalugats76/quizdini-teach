<template>
  <layout-default>
    <h1 v-if="flashMessage">{{ flashMessage }}</h1>
    <h1>Welcome to the Dashboard</h1>
    <match-list></match-list>
  </layout-default>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";

import { AUTH } from "@/store/types";
import { useRoute } from "vue-router";

import { MatchList } from "@/components/";

export default {
  name: "Dashboard",
  components: {
    MatchList,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const { message: flashMessage } = route.params;
    const fetchAuth = () => store.dispatch(`auth/${AUTH.FETCH}`);

    onMounted(() => {
      fetchAuth();
    });

    return {
      flashMessage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
