export const color = {
  props: ["color"],
  computed: {
    bgColorClasses() {
      return {
        [`bg-${this.color}`]: this.color,
      };
    },
    borderColorClasses() {
      return {
        [`border-${this.color}`]: this.color,
      };
    },
    colorClasses() {
      return {
        [`text-${this.color}`]: this.color,
      };
    },
  },
};

export const columns = {
  props: {
    columns: {
      type: [String, Number],
      default: "equal",
    },
  },
  computed: {
    columnClasses() {
      const numWords = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
      ];
      return {
        [`columns--${numWords[this.columns] ? numWords[this.columns] : "equal"}`]: this.columns,
        ["columns--full"]: this.columns === "full",
      };
    },
  },
};

export const focus = {
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.autofocus &&
      document.activeElement !== this.$refs.inputRef &&
      typeof document !== "undefined" &&
      this.setFocus();
  },
  methods: {
    setFocus() {
      this.$refs.inputRef.focus();
    },
  },
};

export const severity = {
  props: {
    alert: {
      type: Boolean,
    },
    danger: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
    info: {
      type: Boolean,
    },
    negative: {
      type: Boolean,
    },
    positive: {
      type: Boolean,
    },
    success: {
      type: Boolean,
    },
    warning: {
      type: Boolean,
    },
  },
  computed: {
    severityClasses() {
      return {
        danger: this.alert || this.danger || this.error || this.negative,
        warning: this.warning,
        info: this.info,
        success: this.success || this.positive,
      };
    },
  },
};

export const size = {
  props: {
    xSmall: {
      type: Boolean,
    },
    small: {
      type: Boolean,
    },
    medium: {
      type: Boolean,
    },
    large: {
      type: Boolean,
    },
    xLarge: {
      type: Boolean,
    },
    size: {
      type: String,
      default: "md",
    },
  },
  computed: {
    sizeClasses() {
      return {
        [`size--xs`]: this.xSmall,
        [`size--sm`]: this.small,
        [`size--md`]: this.medium,
        [`size--lg`]: this.large,
        [`size--xl`]: this.xLarge,
        [`size--${this.size}`]:
          this.size && !this.xSmall && !this.small && !this.medium && !this.large && !this.xLarge,
      };
    },
  },
};

export const theme = {
  props: {
    primary: {
      type: Boolean,
    },
    secondary: {
      type: Boolean,
    },
    tertiary: {
      type: Boolean,
    },
    quaternary: {
      type: Boolean,
    },
    light: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
  },
  computed: {
    themeClasses() {
      return {
        primary: this.primary,
        secondary: this.secondary,
        tertiary: this.tertiary,
        quaternary: this.quaternary,
        light: this.light,
        dark: this.dark,
      };
    },
  },
};

export default {
  color,
  columns,
  focus,
  severity,
  size,
  theme,
};
