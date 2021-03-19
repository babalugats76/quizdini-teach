<template>
  <pre>{{ JSON.stringify(payments, null, 4) }}</pre>
</template>

<script>
export default {
  name: "PaymentTable",
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
