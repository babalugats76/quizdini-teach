<template>
  <layout-default>
    <h1 v-if="flashMessage">{{ flashMessage }}</h1>
    <h1>Welcome to the Profile</h1>
    <label>Loaded: {{ paymentsLoaded }}</label
    ><br />
    <label>Loading: {{ paymentsLoading }}</label>
    <payment-table :payments="payments" />
  </layout-default>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { PAYMENTS } from "@/store/types";
import { useRoute } from "vue-router";

import { PaymentTable } from "@/components";

export default {
  name: "Profile",
  components: {
    PaymentTable,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const { message: flashMessage } = route.params;
    const fetchPayments = () => store.dispatch(`payments/${PAYMENTS.FETCH}`);
    const payments = computed(() => store.getters["payments/all"]);
    const paymentsLoaded = computed(() => store.getters["payments/loaded"]);
    const paymentsLoading = computed(() => store.getters["payments/loading"]);
    onMounted(() => {
      fetchPayments();
    });
    return {
      flashMessage,
      payments,
      paymentsLoaded,
      paymentsLoading,
    };
  },
};
</script>

<style lang="scss" scoped></style>
