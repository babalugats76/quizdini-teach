import { createWebHistory, createRouter } from "vue-router";
//import Counter from "@/components/Counter";
//import Country from "@/components/Country";
import Auth from "@/components/Auth";

const routes = [
  {
    path: "/",
    name: "auth",
    component: Auth,
    props: false,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
