<template>
  <pre>{{ JSON.stringify(payments, null, 4) }}</pre>
  <ui-table :data="payments" />
</template>

<script>
import UiTable from "@/components/ui/UiTable";

export default {
  name: "PaymentTable",
  components: {
    UiTable,
  },
  props: {
    payments: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
