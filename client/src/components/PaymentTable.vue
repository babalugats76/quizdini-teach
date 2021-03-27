<template>
  <tbl class="payment-table">
    <tbl-header>
      <tbl-row>
        <tbl-col>ID</tbl-col>
        <tbl-col>Date</tbl-col>
        <tbl-col>Description</tbl-col>
        <tbl-col>Amount</tbl-col>
        <tbl-col>Credits</tbl-col>
        <tbl-col>Balance</tbl-col>
      </tbl-row>
    </tbl-header>
    <tbl-body>
      <tbl-row v-for="p in payments" :key="`${p.orderId} + '|' + ${p.type}`">
        <tbl-cell
          ><a :href="p.receiptUrl" target="_blank">{{ p.orderId }}</a></tbl-cell
        >
        <tbl-cell>{{
          p.chargeDate && format(Date.parse(p.chargeDate), "MMM d, yyyy, h:mm aa")
        }}</tbl-cell>
        <tbl-cell>{{ p.description }}</tbl-cell>
        <tbl-cell>{{ p.amountFormatted }}</tbl-cell>
        <tbl-cell>{{ p.creditsFormatted }}</tbl-cell>
        <tbl-cell>{{ p.balance }}</tbl-cell>
      </tbl-row>
    </tbl-body>
  </tbl>
</template>
<script>
const { format } = require("date-fns");

import {
  UiTable,
  UiTableBody,
  UiTableHeader,
  UiTableRow,
  UiTableCell,
  UiTableHeaderCell,
} from "@/components/ui/UiTable";

export default {
  name: "PaymentTable",
  components: {
    tbl: UiTable,
    "tbl-header": UiTableHeader,
    "tbl-body": UiTableBody,
    "tbl-row": UiTableRow,
    "tbl-cell": UiTableCell,
    "tbl-col": UiTableHeaderCell,
  },
  props: {
    payments: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup() {
    return {
      format,
    };
  },
};
</script>

<style lang="scss">
.payment-table {
  td:nth-of-type(1):before {
    content: "ID";
  }
  td:nth-of-type(2):before {
    content: "Date";
  }
  td:nth-of-type(3):before {
    content: "Description";
  }
  td:nth-of-type(4):before {
    content: "Amount";
  }
  td:nth-of-type(5):before {
    content: "Credits";
  }
  td:nth-of-type(6):before {
    content: "Balance";
  }
}
</style>
