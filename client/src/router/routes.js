import AuthSuccess from "@/views/AuthSuccess";
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import NotFound from "@/components/NotFound";
import Register from "@/views/Register";
import Test from "@/views/Test";

const routes = [
  {
    path: "/",
    name: "home",
    component: Register,
    meta: {
      navItem: true,
    },
    props: false,
  },
  {
    path: "/test",
    name: "test",
    component: Test,
    meta: {
      navItem: true,
      guest: true,
    },
    props: false,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      navItem: true,
      guest: true,
    },
    props: false,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      navItem: true,
      guest: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      navItem: true,
      auth: true,
    },
    props: true,
  },
  {
    path: "/success",
    name: "success",
    component: AuthSuccess,
    meta: {
      navItem: false,
    },
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "notfound",
    component: NotFound,
    meta: {
      navItem: false,
    },
  },
];

export default routes;
