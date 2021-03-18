<template>
  <layout-default>
    <h1 v-if="flashMessage">{{ flashMessage }}</h1>
    <h1>Welcome to the Dashboard</h1>
  </layout-default>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";

import { AUTH } from "@/store/types";
import { useRoute } from "vue-router";

export default {
  name: "Dashboard",
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
