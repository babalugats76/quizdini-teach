import { createWebHistory, createRouter } from "vue-router";
//import Counter from "@/components/Counter";
import Country from "@/components/Country";

const routes = [
  {
    path: "/",
    name: "country",
    component: Country,
    props: false,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
