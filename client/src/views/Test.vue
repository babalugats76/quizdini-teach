<template>
  <ui-radio-group
    v-model:value="picked"
    :errors="errors"
    class="custom-class"
    :options="choices"
    name="recoveryOptions"
  />
  <h1>{{ picked }}</h1>
</template>

<script>
import { ref } from "vue";
import { UiRadioGroup } from "@ui";

export default {
  name: "Test",
  components: {
    UiRadioGroup,
  },
  props: {
    errors: {
      type: [Array, String],
      default: "",
    },
  },
  setup() {
    const picked = ref("yo");
    return {
      picked,
    };
  },
  data() {
    return {
      choices: [
        {
          key: "0",
          value: "username",
          text: "recoverying my username",
        },
        {
          key: "1",
          value: "password",
          text: "resetting my password",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
