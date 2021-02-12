import Layout from "@/layouts/Layout";
import LayoutDefault from "@/layouts/LayoutDefault";

const components = [Layout, LayoutDefault];

export default {
  install: (app, options) => {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
