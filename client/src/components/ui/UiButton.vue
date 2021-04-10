<script>
import { focus, severity, size, theme } from "@mixins/";

export const UiButton = {
  name: "UiButton",
  mixins: [focus, severity, size, theme],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      required: false,
      default: "button",
    },
    type: {
      type: String,
      default: "button",
    },
  },
  computed: {
    classes() {
      return {
        "ui-btn": true,
        "ui-btn--disabled": this.disabled,
        ...this.sizeClasses,
        ...this.themeClasses,
        ...this.severityClasses,
      };
    },
  },
  render() {
    const Tag = `${this.tag}`;
    if (this.tag.toLowerCase() === "input") {
      return <Tag ref="inputRef" class={this.classes} type={this.type} />;
    }
    return (
      <Tag ref="inputRef" class={this.classes}>
        {this.$slots.default && this.$slots.default()}
      </Tag>
    );
  },
};

export const UiButtonGroup = {
  name: "UiButtonGroup",
  computed: {
    classes() {
      return {
        "ui-btn-group": true,
      };
    },
  },
  render() {
    return <div class={this.classes}>{this.$slots.default && this.$slots.default()}</div>;
  },
};

export default UiButton;
</script>

<style lang="scss">
$btn-border-radius: 0.375rem;
$btn-disabled-opacity: 0.65;

$btn-sizes: (
  "xs": 0.75rem,
  "sm": 0.875rem,
  "md": 1rem,
  "lg": 1.1875rem,
  "xl": 1.375rem,
);

.ui-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375em 0.75em;
  border-radius: $btn-border-radius;
  @include font("Montserrat", "semi-bold");
  line-height: 1.25;
  text-align: center;
  vertical-align: middle;
  letter-spacing: $tracking-tight;
  outline: 0;
  @include sizes($btn-sizes);
  @each $theme, $color in $color-themes {
    &.#{$theme} {
      @include button-variant($color);
    }
  }
  &--disabled,
  &:disabled,
  &.disabled {
    pointer-events: none;
    opacity: $btn-disabled-opacity;
  }
  &--active,
  &:active {
    opacity: 0.85;
  }
  &:hover {
    opacity: 0.8;
  }
  &:focus {
    opacity: 0.5;
  }
}

.ui-btn-group {
  display: inline-flex;
  flex-direction: row;
  vertical-align: baseline;
}
</style>
