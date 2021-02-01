<template>
  <div>
    <Auth />
    <Country />
  </div>
</template>

<script>
import Auth from "@/components/Auth";
import Country from "@/components/Country";

export default {
  name: "ApiTester",
  components: {
    Auth: Auth,
    Country: Country,
  },
};
</script>

<style lang="scss" scoped></style>
