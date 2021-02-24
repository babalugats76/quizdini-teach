// import AuthSuccess from "@/views/AuthSuccess";
// import Dashboard from "@/views/Dashboard";
// import Login from "@/views/Login";
// import NotFound from "@/components/NotFound";
// import Register from "@/views/Register";
// import Test from "@/views/Test";

const routes = [
  {
    path: "/",
    name: "Home",
    view: "Landing",
    meta: {
      navItem: true,
    },
    props: false,
  },
  {
    path: "/test",
    name: "Test",
    view: "Test",
    meta: {
      navItem: true,
      guest: true,
    },
    props: false,
  },
  {
    path: "/register",
    name: "Sign Up",
    view: "Register",
    meta: {
      navItem: true,
      guest: true,
    },
    props: false,
  },
  {
    path: "/login",
    name: "Login",
    view: "Login",
    meta: {
      navItem: true,
      guest: true,
    },
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
  },
  {
    path: "/success",
    name: "Success",
    view: "AuthSuccess",
    meta: {
      navItem: false,
    },
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    view: "NotFound",
    meta: {
      navItem: false,
    },
  },
];

export default routes;
