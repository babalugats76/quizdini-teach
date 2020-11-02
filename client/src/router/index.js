import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "@/components/HelloWorld";

const routes = [
  {
    path: "/",
    name: "hello",
    component: HelloWorld,
    props: false,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
