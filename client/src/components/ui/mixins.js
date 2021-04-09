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
    },
    mobile: {
      type: [String, Number],
    },
    tablet: {
      type: [String, Number],
    },
    laptop: {
      type: [String, Number],
    },
    desktop: {
      type: [String, Number],
    },
    widescreen: {
      type: [String, Number],
    },
  },
  computed: {
    columnClasses() {
      const numWords = [
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
      const numToWord = (num, fallback = "equal") => {
        if (isNaN(num)) return num;
        if (!Number.isInteger(num) || num <= 0 || num > numWords.Length + 1) return fallback;
        return numWords[num - 1];
      };
      return {
        [`columns--${numToWord(this.columns)}`]: this.columns,
        [`mobile--${numToWord(this.mobile)}`]: this.mobile,
        [`tablet--${numToWord(this.tablet)}`]: this.tablet,
        [`desktop--${numToWord(this.desktop)}`]: this.desktop,
        [`widescreen--${numToWord(this.widescreen)}`]: this.widescreen,
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
