const routes = [
  {
    path: "/",
    name: "Home",
    view: "Landing",
    meta: {
      navItem: true,
    },
    props: false,
    webpackChunkName: "public",
  },
  {
    path: "/test",
    name: "Test",
    view: "Test",
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
    webpackChunkName: "public",
  },
  {
    path: "/register",
    name: "Sign Up",
    view: "Register",
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
    webpackChunkName: "public",
  },
  {
    path: "/login",
    name: "Login",
    view: "Login",
    meta: {
      navItem: true,
      guest: true,
    },
    props: true,
    webpackChunkName: "public",
  },
  {
    path: "/success",
    name: "Success",
    view: "AuthSuccess",
    meta: {
      navItem: false,
    },
    props: false,
    webpackChunkName: "public",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    view: "Dashboard",
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
    webpackChunkName: "member",
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    view: "NotFound",
    meta: {
      navItem: false,
    },
    webpackChunkName: "public",
  },
];

export default routes;
