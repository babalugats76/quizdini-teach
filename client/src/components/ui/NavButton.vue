<template>
  <router-link v-slot="{ navigate }" :to="to" custom>
    <ui-button v-bind="$attrs" role="link" @click="navigate" @keypress.enter="navigate">
      <slot />
    </ui-button>
  </router-link>
</template>

<script>
import { UiButton } from "./UiButton";
export default {
  name: "NavButton",
  components: {
    UiButton,
  },
  inheritAttr: false,
  props: {
    to: {
      type: [String, Object],
      required: true,
      default: () => {},
    },
  },
};
</script>
