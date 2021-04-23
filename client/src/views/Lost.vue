<template>
  <layout-default>
    <ui-radio-group
      v-model:value="selected"
      class="lost__options"
      :options="options"
      name="recoveryOptions"
    />
    <lost-form />
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
    const selected = ref("username");
    const options = [
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
      options,
      selected,
    };
  },
};
</script>
