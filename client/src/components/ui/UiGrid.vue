<script>
import { columns } from "@mixins";

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
// map screen to globally-defined breakpoints
$screens: (
  "mobile": "sm",
  "tablet": "md",
  "laptop": "lg",
  "desktop": "xl",
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

$grid-gap: 1rem;

@mixin column-width($frac, $gap: #{$grid-gap}) {
  $widthPct: (1 / $frac);
  width: calc(#{percentage($widthPct)} - #{$gap});
}

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
    width: calc(
      100% + #{$grid-gap}
    ) !important; /* hack until gap property supported with flexbox on all browsers */
    padding-top: $grid-gap;
    padding-bottom: $grid-gap;
    margin: (-$grid-gap) 0 0 (-$grid-gap);
  }

  @at-root #{$grid} > #{$row} > #{$column} {
    position: relative;
    display: inline-block;
    @include column-width(1);
    padding: 0 $grid-gap;
    margin: $grid-gap 0 0 $grid-gap;
    vertical-align: top;
  }

  @at-root #{$grid} > #{$row}[class$="--full"] > #{$column} {
    @include column-width((length($columns) - 1));
  }

  @at-root #{$grid} > #{$row}[class$="--equal"] > #{$column} {
    flex-grow: 1;
    width: unset;
  }

  @for $i from 1 through length($columns) {
    @if $i > 1 {
      $column-count: nth($columns, $i);
      @at-root #{$grid} > #{$row}:not(.stackable).columns--#{$column-count} > #{$column} {
        @include column-width($i - 1);
      }
    }
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
    }
  }
}
</style>
