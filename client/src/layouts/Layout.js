export default {
  name: "Layout",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "div",
      required: true,
    },
  },
  emits: ["update:layout"],
  setup(props, { emit, slots }) {
    emit("update:layout", props.name);
    return () => slots.default();
  },
};
