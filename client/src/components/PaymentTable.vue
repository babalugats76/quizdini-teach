<script>
const { format } = require("date-fns");

export default {
  name: "PaymentTable",
  components: {
    // UiTable,
  },
  props: {
    payments: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  methods: {
    header() {
      return (
        <div class="ui-table__row ui-table__row--header">
          <div class="ui-table__cell ui-table__cell--heading">Order #</div>
          <div class="ui-table__cell ui-table__cell--date ui-table__cell--heading">
            Date
          </div>
          <div class="ui-table__cell ui-table__cell--heading">Description</div>
          <div class="ui-table__cell ui-table__cell--heading">Amount</div>
          <div class="ui-table__cell ui-table__cell--heading">Credits</div>
          <div class="ui-table__cell ui-table__cell--heading">Balance</div>
        </div>
      );
    },
    rows() {
      return (
        this.payments.length &&
        this.payments.map((row) => {
          return (
            <div class="ui-table__row">
              <div class="ui-table__cell ui-table__cell--data">
                <a
                  href={row.receiptUrl}
                  target="_blank"
                  style={{ textDecoration: "underline" }}
                >
                  {row.orderId}
                </a>
              </div>
              <div class="ui-table__cell ui-table__cell--date ui-table__cell--data">
                {row.chargeDate &&
                  format(Date.parse(row.chargeDate), "MMM d, yyyy, h:mm aa")}
              </div>
              <div class="ui-table__cell ui-table__cell--data">
                {row.description}
              </div>
              <div class="ui-table__cell ui-table__cell--data">
                {row.amountFormatted}
              </div>
              <div class="ui-table__cell ui-table__cell--data">
                {row.creditsFormatted}
              </div>
              <div class="ui-table__cell ui-table__cell--data">
                {row.balance}
              </div>
            </div>
          );
        })
      );
    },
  },
  render() {
    return (
      <div class="ui-table--responsive">
        {this.header()}
        {this.rows()}
      </div>
    );
  },
};
</script>

<style lang="scss">
$breakpoint: 500px;

.ui-table {
  $tbl: &;
  &__cell {
    display: block;
    padding: 0.25rem 0.5rem;
    width: 100% !important;
  }
  &--responsive {
    #{$tbl}__row {
      &--header {
        background-color: #ccc;
      }
    }
  }
}

/* Responsive
==================================== */
@media all and (min-width: $breakpoint) {
  body {
    background-color: rgba(0, 0, 255, 0.05);
  }

  .ui-table--responsive .ui-table__cell--date {
    width: 200px !important;
  }
  .ui-table {
    $tbl: &;
    &--responsive {
      #{$tbl}__row {
        display: flex;
      }
      #{$tbl}__cell {
        flex: 0;
      }
    }
  }
}

table,
tr,
td,
th {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
}

table tr:first-child {
  text-transform: uppercase;
}
</style>
