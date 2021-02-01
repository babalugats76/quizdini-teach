import { createWebHistory, createRouter } from "vue-router";
//import Counter from "@/components/Counter";
//import Country from "@/components/Country";
//import Auth from "@/components/Auth";
import ApiTester from "@/components/ApiTester";

const routes = [
  {
    path: "/",
    name: "apitester",
    component: ApiTester,
    props: false,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
