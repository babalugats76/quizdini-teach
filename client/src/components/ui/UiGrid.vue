<script>
import { columns } from "./mixins";

export const UiGrid = {
  name: "UiGrid",
  computed: {
    classes() {
      return {
        "ui-grid": true,
      };
    },
  },
  render() {
    return <div class={this.classes}>{this.$slots.default && this.$slots.default()}</div>;
  },
};

export const UiGridRow = {
  name: "UiGridRow",
  mixins: [columns],
  computed: {
    classes() {
      return {
        "ui-grid__row": true,
        ...this.columnClasses,
      };
    },
  },
  render() {
    return <div class={this.classes}>{this.$slots.default && this.$slots.default()}</div>;
  },
};

export const UiGridColumn = {
  name: "UiGridColumn",
  computed: {
    classes() {
      return {
        "ui-grid__column": true,
      };
    },
  },
  render() {
    return <div class={this.classes}>{this.$slots.default && this.$slots.default()}</div>;
  },
};

export default UiGrid;
</script>

<style lang="scss">
$gridGap: 1rem;

$columns: (
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
  "sixteen"
);

.ui-grid {
  $grid: &;
  $row: #{$grid}__row;
  $column: #{$grid}__column;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  align-items: stretch;
  margin: -1 * $gridGap;

  &__row {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: inherit;
    align-items: stretch;
    width: 100% !important;
    padding-top: $gridGap;
    padding-bottom: $gridGap;
  }

  @at-root #{$grid} > #{$row}[class*="columns--"] > #{$column} {
    @include column();
  }

  @for $i from 1 through length($columns) {
    @if $i > 1 {
      $label: nth($columns, $i);
      @at-root #{$grid} > #{$row}.columns--#{$label} > #{$column} {
        @include column-width($i - 1);
      }
    }
  }

  @at-root #{$grid} > #{$row}.columns--full > #{$column} {
    @include column-width((length($columns) - 1));
  }

  @at-root #{$grid} > #{$row}.columns--equal > #{$column} {
    flex-grow: 1;
  }

  @at-root #{$grid} > #{$row} > #{$column} {
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
    &:only-child {
      width: 100%;
    }
  }
}
</style>
