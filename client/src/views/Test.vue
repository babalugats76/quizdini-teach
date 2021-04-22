<template>
  <UiRadio v-model:selected="picked" label="Yo" name="radioGroup" value="Yo" />
  <UiRadio v-model:selected="picked" label="Mama" name="radioGroup" value="Mama" />
  <div>
    <label>{{ picked }}</label>
  </div>
</template>

<script>
import { UiRadio } from "@ui";

export default {
  name: "Test",
  components: {
    UiRadio,
  },
  data() {
    return {
      picked: "Yo",
    };
  },
};
</script>

<style lang="scss" scoped></style>
