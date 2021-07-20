<template>
  <div :class="classes" v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
import { computed, inject, onBeforeMount, ref, watch } from "vue";

export default {
  name: "UiTab",
  props: {
    title: {
      type: String,
      default: "Tab",
    },
  },
  setup() {
    const index = ref(0);
    const isActive = ref(false);
    const tabs = inject("TabsProvider");

    watch(
      () => tabs.selectedIndex,
      () => {
        isActive.value = index.value === tabs.selectedIndex;
      }
    );

    const classes = computed(() => ({
      "ui-tab": true,
      "ui-tab--selected": index.value === tabs.selectedIndex,
    }));

    onBeforeMount(() => {
      index.value = tabs.count;
      tabs.count++;
      isActive.value = index.value === tabs.selectedIndex;
    });

    return {
      classes,
      index,
      isActive,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui-tab {
  display: inline-block;
  width: 100%;
  background-color: #fff;
  // &--selected {  }
}
</style>
