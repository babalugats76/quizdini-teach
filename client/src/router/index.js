import { createWebHistory, createRouter } from "vue-router";
//import Counter from "@/components/Counter";
//import Country from "@/components/Country";
//import Auth from "@/components/Auth";
import ApiTester from "@/components/ApiTester";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";

import { computed } from "vue";
import store from "@/store";

// In your router initialization code
const storeInit = store.dispatch("init");

const isAuthenticated = computed(() => store.state.auth.data.loggedIn);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/logout",
    redirect: "/api/logout",
  },
  {
    path: "/",
    name: "apitester",
    component: ApiTester,
    props: false,
  },
  {
    path: "/api/logout",
    name: "logout",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("initialization happens here...");
  storeInit
    .then(next)
    .catch((e) => console.log("unable to initialize store", e));
});

router.beforeEach((to, from, next) => {
  console.log("is authenticated", isAuthenticated.value);
  if (to.matched.some((r) => r.meta.guest)) {
    console.log("route is guest only");
    if (isAuthenticated.value) {
      console.log("user is authenticated, i.e., not allowed");
      next(false);
    } else {
      console.log("user not authenticated");
      next();
    }
  } else if (to.matched.some((r) => r.meta.requiresAuth)) {
    console.log("route requires to be authenticated");
    if (isAuthenticated.value) {
      console.log("user is authenticated, i.e., allowed");
      next();
    } else {
      next(false);
    }
  } else {
    console.log("not a protected route; proceed");
    next();
  }
});

export default router;
