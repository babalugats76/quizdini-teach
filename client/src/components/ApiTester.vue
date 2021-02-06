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
  created: () => {
    console.log("created...");
    const url = "/dashboard";
    if (window.opener) {
      window.opener.open(url, "_self");
      window.opener.focus();
      window.close();
    }
  },
};
</script>

<style lang="scss" scoped></style>
