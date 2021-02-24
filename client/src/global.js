import LayoutDefault from "@/layouts/LayoutDefault";

const components = [LayoutDefault];

export default {
  install: (app, options) => {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
