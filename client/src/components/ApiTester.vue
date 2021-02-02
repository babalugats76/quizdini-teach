<template>
  <div>
    <Login />
    <Auth />
    <Country />
  </div>
</template>

<script>
import Auth from "@/components/Auth";
import Country from "@/components/Country";
import Login from "@/components/Login";

export default {
  name: "ApiTester",
  components: {
    Auth: Auth,
    Country: Country,
    Login: Login,
  },
};
</script>

<style lang="scss" scoped></style>
