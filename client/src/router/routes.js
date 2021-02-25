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
