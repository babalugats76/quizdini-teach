<template>
  <nav class="nav">
    <NavItems :items="routes" :authenticated="authenticated" />
    <a v-if="authenticated" href="/logout" class="nav__item" target="_self"
      >logout</a
    >
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import routes from "@/router/routes";

const NavItems = ({ items, authenticated }) =>
  items
    .filter((item) => {
      const { name, meta } = item;
      const { navItem = false, requiresAuth = false, guest = false } =
        meta || {};
      // console.log("logged in?", authenticated);
      // console.log("name", name);
      // console.log("requiresAuth", requiresAuth);
      // console.log("guest", guest);
      // console.log(
      //   "show",
      //   navItem
      //     ? authenticated
      //       ? requiresAuth || !guest
      //       : !requiresAuth
      //     : false
      // );
      return navItem
        ? authenticated
          ? requiresAuth || !guest
          : !requiresAuth
        : false;
    })
    .map((item) => {
      const { name } = item;
      return (
        <router-link class="nav__item" to={{ name: name }} key={name}>
          {name}
        </router-link>
      );
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

<style lang="scss">
.nav {
  display: block;
  &__item {
    display: inline-block;
    padding: 1rem;
    margin: 0.25rem 0.75rem;
    text-transform: capitalize;
  }
}
</style>
