<template>
  <nav class="nav">
    <NavItems :items="routes" :authenticated="auth.loggedIn" />
    <span v-if="auth.loggedIn && auth.credits >= 0" class="nav__item"
      >Credits: {{ auth.credits }}
    </span>
    <a
      v-if="auth.loggedIn"
      href="/logout"
      class="nav__item"
      target="_self"
      tabindex="-1"
      >logout</a
    >
    <span
      v-if="auth.loggedIn && auth.accountType === 'google'"
      class="nav__item badge"
    >
      <img
        v-if="auth.accountType === 'google'"
        :src="auth.googlePicture"
        class="badge--google"
      />
    </span>
    <span
      v-if="auth.loggedIn && auth.accountType === 'local'"
      class="nav__item nav__item--lc"
    >
      {{ auth.username }}
    </span>
  </nav>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import routes from "@/router/routes";

const NavItems = ({ items, authenticated }) =>
  items
    .filter((item) => {
      const {
        meta: { navItem = false, auth = false, guest = false } = {},
      } = item;
      return navItem ? (authenticated ? auth || !guest : !auth) : false;
    })
    .map((item) => {
      const { name } = item;
      return (
        <router-link
          class="nav__item"
          to={{ name: name }}
          key={name}
          tabIndex={-1}
        >
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
    const auth = computed(() => store.getters["auth/auth"]);
    // const authenticated = computed(() => store.getters["auth/authenticated"]);
    // const credits = computed(() => store.getters["auth/credits"]);
    return {
      auth,
      // authenticated,
      // credits,
      routes,
    };
  },
};
</script>

<style lang="scss">
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  &__item {
    $item: &;
    flex: 1;
    padding: 1rem;
    margin: 0.25rem 0.75rem;
    @include font("Montserrat", "extra-bold");
    text-align: center;
    text-transform: capitalize;
    &--lc {
      text-transform: none;
    }
    // To be replaced with a proper badge component
    &.badge {
      $badge: &;
      flex: 0 0 auto;
      width: 2rem;
      height: 2rem;
      padding: 0;
      margin: 0 1rem;
      vertical-align: middle;
      @at-root #{$badge} .badge--google {
        border-radius: 100%;
      }
    }
  }
}
</style>
