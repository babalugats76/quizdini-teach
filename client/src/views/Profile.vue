<template>
  <layout-default>
    <label>{{ paymentsLoaded }}</label>
    <label>{{ paymentsLoading }}</label>
    <payment-table :payments="payments" />
  </layout-default>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { PAYMENTS } from "@/store/types";
import { PaymentTable } from "@/components";

export default {
  name: "Profile",
  components: {
    PaymentTable,
  },
  setup() {
    const store = useStore();
    const fetchPayments = () => store.dispatch(`payments/${PAYMENTS.FETCH}`);
    const payments = computed(() => store.getters["payments/all"]);
    const paymentsLoaded = computed(() => store.getters["payments/loaded"]);
    const paymentsLoading = computed(() => store.getters["payments/loading"]);
    onMounted(() => {
      fetchPayments();
    });
    return {
      payments,
      paymentsLoaded,
      paymentsLoading,
    };
  },
};
</script>

<style lang="scss" scoped></style>
