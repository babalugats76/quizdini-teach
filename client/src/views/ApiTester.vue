<template>
  <layout name="LayoutDefault">
    <div>
      <auth />
      <country />
    </div>
  </layout>
</template>

<script>
import Layout from "@/layouts/Layout";
import Auth from "@/components/Auth";
import Country from "@/components/Country";

export default {
  name: "ApiTester",
  components: {
    Auth,
    Country,
    Layout,
  },
};
</script>

<style lang="scss" scoped></style>
