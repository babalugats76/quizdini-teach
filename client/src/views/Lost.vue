<template>
  <layout-default>
    <ui-radio-group
      v-model:value="recoveryType"
      class="lost__options"
      :options="recoveryOptions"
      name="recoveryOptions"
    />
    <lost-form :recovery-type="recoveryType" />
  </layout-default>
</template>

<script>
import { ref } from "vue";
import { UiRadioGroup } from "@ui";
import { LostForm } from "@components";

export default {
  name: "Lost",
  components: {
    LostForm,
    UiRadioGroup,
  },
  setup() {
    const recoveryType = ref("username");
    const recoveryOptions = [
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
    ];
    return {
      recoveryOptions,
      recoveryType,
    };
  },
};
</script>
