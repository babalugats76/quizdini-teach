const routes = [
  {
    path: "/test",
    name: "Test",
    component: () => import(/* webpackChunkName: "public" */ "../views/Test.vue"),
    meta: {
      navItem: true,
    },
  },
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "public" */ "../views/Landing.vue"),
    meta: {
      navItem: true,
    },
    props: false,
  },
  {
    path: "/credits",
    name: "Credits",
    component: () => import(/* webpackChunkName: "members" */ "../views/Credits.vue"),
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
  },
  {
    path: "/register",
    name: "Sign Up",
    component: () => import(/* webpackChunkName: "public" */ "../views/Register.vue"),
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "public" */ "../views/Login.vue"),
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
  },
  {
    path: "/verify",
    name: "Verify",
    component: () => import(/* webpackChunkName: "public" */ "../views/Verify.js"),
    meta: {
      navItem: false,
      guest: true,
    },
  },
  {
    path: "/success",
    name: "Success",
    component: () => import(/* webpackChunkName: "public" */ "../views/AuthSuccess.vue"),
    meta: {
      navItem: false,
    },
    props: false,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import(/* webpackChunkName: "members" */ "../views/Dashboard.vue"),
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
  },
  {
    path: "/match/:id",
    name: "Match",
    component: () => import(/* webpackChunkName: "members" */ "../views/EmptyRouterView.vue"),
    meta: {
      navItem: false,
      auth: true,
    },
    children: [
      {
        path: "",
        name: "MatchEdit",
        component: () => import(/* webpackChunkName: "members" */ "../views/MatchEdit.vue"),
        props: true,
      },
      {
        path: "stats",
        name: "MatchStats",
        component: () => import(/* webpackChunkName: "members" */ "../views/MatchStats.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import(/* webpackChunkName: "members" */ "../views/Profile.vue"),
    meta: {
      navItem: false,
      auth: true,
    },
    props: true,
  },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "public" */ "../views/NotFound.vue"),
    meta: {
      navItem: false,
    },
  },
];

export default routes;
