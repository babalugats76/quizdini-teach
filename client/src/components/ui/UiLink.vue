<script>
import { focus, color } from "./mixins";

export default {
  name: "ui-link",
  mixins: [focus, color],
  props: {
    href: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
      default: "_blank",
    },
  },
  computed: {
    classes() {
      return {
        "ui-link": true,
        ...this.colorClasses,
      };
    },
  },
  render() {
    /***
     * You can use `{...this.$attrs}` if you have multiple elements
     * and need to mark one to have an `id`, for example
     **/
    return (
      <a
        class={this.classes}
        href={this.href}
        rel="noopener noreferrer"
        target={this.target}
      >
        {this.$slots.default()}
      </a>
    );
  },
};
</script>

<style lang="scss" scoped>
.ui-link {
  display: inline;
}
</style>
