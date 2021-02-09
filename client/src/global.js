import LayoutDefault from "./layouts/LayoutDefault.vue";

const components = [LayoutDefault];

export default {
  install: (app, options) => {
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};
