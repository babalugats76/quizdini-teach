<script>
import { columns } from "./mixins";

export const UiGrid = {
  name: "UiGrid",
  props: {
    stackable: {
      type: Boolean,
    },
  },
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
        stackable: true,
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
$grid-gap: 1rem;

// map screen to globally-defined breakpoints
$screens: (
  "mobile": "sm",
  "tablet": "md",
  "computer": "lg",
  "monitor": "xl",
  "widescreen": "2xl",
);

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
  margin: -1 * $grid-gap;

  &__row {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: inherit;
    align-items: stretch;
    width: calc(100% + #{$grid-gap}) !important;
    padding-top: $grid-gap;
    padding-bottom: $grid-gap;
    margin: (-$grid-gap) 0 0 (-$grid-gap);
  }

  @at-root #{$grid} > #{$row} > #{$column} {
    @include column();
    margin: $grid-gap 0 0 $grid-gap;
  }

  @each $screen, $bp in $screens {
    @include breakpoint($bp) {
      @for $i from 1 through length($columns) {
        @if $i > 1 {
          $column-count: nth($columns, $i);
          @at-root #{$grid} > #{$row}.stackable.#{$screen}--#{$column-count} > #{$column} {
            @include column-width($i - 1);
          }
        }
      }

      @at-root #{$grid} > #{$row}.stackable[class*="#{$screen}--"] > #{$column} {
        // &:first-child {
        //   padding-left: 0;
        // }
        // &:last-child {
        //   padding-right: 0;
        // }
        &:only-child {
          width: 100%;
        }
      }

      @at-root #{$grid} > #{$row}.stackable.#{$screen}--full > #{$column} {
        @include column-width((length($columns) - 1));
      }

      @at-root #{$grid} > #{$row}.stackable.#{$screen}--equal > #{$column} {
        flex-grow: 1;
      }
    }
  }
}
</style>
