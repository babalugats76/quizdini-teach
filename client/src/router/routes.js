const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "public" */ "../views/Landing.vue"),
    meta: {
      navItem: true,
    },
    props: false,
  },
  {
    path: "/test",
    name: "Stripe",
    component: () => import(/* webpackChunkName: "test" */ "../views/Test.vue"),
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
  },
  {
    path: "/register",
    name: "Sign Up",
    component: () =>
      import(/* webpackChunkName: "public" */ "../views/Register.vue"),
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "public" */ "../views/Login.vue"),
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
  },
  {
    path: "/success",
    name: "Success",
    component: () =>
      import(/* webpackChunkName: "public" */ "../views/AuthSuccess.vue"),
    meta: {
      navItem: false,
    },
    props: false,
    webpackChunkName: "public",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "members" */ "../views/Dashboard.vue"),
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "members" */ "../views/Profile.vue"),
    meta: {
      navItem: false,
      auth: true,
    },
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: () =>
      import(/* webpackChunkName: "public" */ "../views/NotFound.vue"),
    meta: {
      navItem: false,
    },
  },
];

export default routes;
