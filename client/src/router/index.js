import { createWebHistory, createRouter } from "vue-router";
import { computed } from "vue";
import routes from "./routes";
import store from "@/store";

const storeInit = store.dispatch("init");
const authenticated = computed(() => store.getters["auth/authenticated"]);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/***
 * Initialization
 *
 * Used to load store with *minimum* required state
 * Promise must be resolved before subsequent `forEach`'s will execute
 * Necessary to fetch user information using session cookie
 * Seemingly needed in all SPAs with portal-esque functionality
 *
 */
router.beforeEach((to, from, next) => {
  storeInit
    .then(next)
    .catch((e) => console.log("Unable to initialize store", e));
});

/***
 * Navigation Guards
 *
 * Guests -> redirect to dashboard if authenticated
 * Member -> redirect to login if not authenticated
 * Others -> serve up "unguarded" route
 *
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some((r) => r.meta.guest)) {
    if (authenticated.value) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else if (to.matched.some((r) => r.meta.auth)) {
    if (authenticated.value) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
