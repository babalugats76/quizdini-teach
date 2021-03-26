import { createWebHistory, createRouter } from "vue-router";
import { computed } from "vue";
import routes from "./routes";
import store from "@/store";

const storeInit = store.dispatch("init");
const loggedIn = computed(() => store.getters["auth/loggedIn"]);

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
    if (loggedIn.value) {
      next({ name: "Dashboard" });
    } else {
      next();
    }
  } else if (to.matched.some((r) => r.meta.auth)) {
    if (loggedIn.value) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
