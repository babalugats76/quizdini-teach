import { createWebHistory, createRouter } from "vue-router";
import Counter from "@/components/Counter";

const routes = [
  {
    path: "/",
    name: "counter",
    component: Counter,
    props: false,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
