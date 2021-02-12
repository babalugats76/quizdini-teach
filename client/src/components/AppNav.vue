<template>
  <div>
    <strong> {{ authenticated }} </strong>
    <NavItems :items="routes" :authenticated="authenticated" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import routes from "@/router/routes";

const NavItems = ({ items, authenticated }) =>
  items
    .filter((item) => {
      const { name, meta } = item;
      const { requiresAuth = false, guest = false } = meta || {};
      console.log("logged in?", authenticated);
      console.log("name", name);
      console.log("requiresAuth", requiresAuth);
      console.log("guest", guest);
      console.log("show", authenticated ? requiresAuth || !guest : true);
      return authenticated ? requiresAuth || !guest : true;
    })
    .map((item) => {
      const { name } = item;
      return <span key="name">{name}</span>;
    });

export default {
  name: "AppNav",
  components: {
    NavItems,
  },
  setup() {
    const store = useStore();
    const authenticated = computed(() => store.getters["auth/authenticated"]);

    return {
      authenticated,
      routes,
    };
  },
};
</script>

<style lang="scss" scoped></style>
