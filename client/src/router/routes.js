import ApiTester from "@/views/ApiTester";
import AuthSuccess from "@/views/AuthSuccess";
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import NotFound from "@/components/NotFound";

const routes = [
  {
    path: "/",
    name: "home",
    component: ApiTester,
    meta: {
      navItem: true,
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
      requiresAuth: true,
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
