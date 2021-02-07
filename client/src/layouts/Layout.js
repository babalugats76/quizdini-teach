import LayoutDefault from "./LayoutDefault";
export default {
  name: "Layout",
  components: {
    LayoutDefault,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  emits: ["update:layout"],
  created() {
    // Check if the layout component
    // has already been registered.
    // if (!Vue.options.components[this.name]) {
    //   Vue.component(this.name, () => import(`../layouts/${this.name}.vue`));
    // }
    console.log("Name passed to layout", this.$props.name);
    this.$parent.$emit("update:layout", this.name);
  },
  render() {
    return this.$slots.default();
  },
};
