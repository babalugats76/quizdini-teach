import ApiTester from "@/views/ApiTester";
import AuthSuccess from "@/views/AuthSuccess";
import Dashboard from "@/components/Dashboard";
import Login from "@/views/Login";
import NotFound from "@/components/NotFound";

const routes = [
  {
    path: "/",
    name: "home",
    component: ApiTester,
    meta: {},
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
    meta: {
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: "/success",
    name: "success",
    component: AuthSuccess,
    meta: {},
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "notfound",
    component: NotFound,
    meta: {},
  },
];

export default routes;
