<script>
export const UiTable = {
  name: "UiTable",
  computed: {
    classes() {
      return {
        "ui-table": true,
      };
    },
  },
  render() {
    return <table class={this.classes}>{this.$slots.default && this.$slots.default()}</table>;
  },
};

export const UiTableRow = {
  name: "UiTableRow",
  computed: {
    classes() {
      return {
        "ui-table__row": true,
      };
    },
  },
  render() {
    return <tr class={this.classes}>{this.$slots.default && this.$slots.default()}</tr>;
  },
};

export const UiTableHeader = {
  name: "UiTableHeader",
  computed: {
    classes() {
      return {
        "ui-table__header": true,
      };
    },
  },
  render() {
    return <thead class={this.classes}>{this.$slots.default && this.$slots.default()}</thead>;
  },
};

export const UiTableBody = {
  name: "UiTableBody",
  computed: {
    classes() {
      return {
        "ui-table__body": true,
      };
    },
  },
  render() {
    return <tbody class={this.classes}>{this.$slots.default && this.$slots.default()}</tbody>;
  },
};

export const UiTableHeaderCell = {
  name: "UiTableHeaderCell",
  props: {
    collapsing: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "ui-table__header-cell": true,
        [`ui-table__header-cell--collapsing`]: this.collapsing,
      };
    },
  },
  render() {
    return <th class={this.classes}>{this.$slots.default && this.$slots.default()}</th>;
  },
};

export const UiTableCell = {
  name: "UiTableCell",
  props: {
    collapsing: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "ui-table__cell": true,
        [`ui-table__cell--collapsing`]: this.collapsing,
      };
    },
  },
  render() {
    return <td class={this.classes}>{this.$slots.default && this.$slots.default()}</td>;
  },
};

export default UiTable;
</script>

<style lang="scss">
.ui-table {
  width: 100%;
  &__cell,
  &__header-cell {
    padding: 0.25rem 0.5rem;
    vertical-align: top;
  }
  &__cell:before {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
}

@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  .ui-table,
  .ui-table__row,
  .ui-table__header,
  .ui-table__body,
  .ui-table__cell,
  .ui-table__header-cell {
    display: block;
  }

  .ui-table {
    &__header {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    &__row {
      margin: 0 0 1rem 0;
    }

    &__cell,
    &__header-cell {
      padding: 0.125rem 0.25rem;
    }

    &__cell {
      /* Behave  like a "row" */
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
    }

    &__cell:before {
      /* Now like a table header */
      position: absolute;
      /* Top/left values mimic padding */
      top: 0;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }
  }
}
</style>
