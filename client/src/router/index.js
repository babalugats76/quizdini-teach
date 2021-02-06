import { createWebHistory, createRouter } from "vue-router";
import { computed } from "vue";
import store from "@/store";

import ApiTester from "@/components/ApiTester";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import NotFound from "@/components/NotFound";

const storeInit = store.dispatch("init");
const loggedIn = computed(() => store.getters["auth/loggedIn"]);

// function dynamicPropsFn(route) {
//   return {
//     ...route.params,
//     loggedIn,
//   };
// }

const routes = [
  {
    path: "/",
    name: "home",
    component: ApiTester,
    props: false,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "notfound",
    component: NotFound,
  },
];

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
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (loggedIn.value) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
