<template>
  <layout-default>
    <checkout-form :credits="10" />
  </layout-default>
</template>

<script>
import { CheckoutForm } from "@/components/";

export default {
  name: "Test",
  components: {
    CheckoutForm,
  },
};
</script>
