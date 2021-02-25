<template>
  <div>
    <h1>Script Tester</h1>
    <p>{{ loaded }}</p>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import useScript from "@/compose/useScript";

export default {
  setup() {
    const { loaded, error } = useScript("https://js.stripe.com/v3/", {
      async: true,
      onload: () => console.log("stripe loaded..."),
    });
    return {
      loaded,
      error,
    };
  },
};
</script>

<style lang="scss" scoped></style>
