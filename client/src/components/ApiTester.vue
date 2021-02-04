<template>
  <div>
    <auth />
    <country />
  </div>
</template>

<script>
import Auth from "@/components/Auth";
import Country from "@/components/Country";

export default {
  name: "api-tester",
  components: {
    Auth,
    Country,
  },
};
</script>

<style lang="scss" scoped></style>
