<template>
  <div :class="classes">
    <ul class="ui-tabs__header">
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        :class="itemClasses(index)"
        @click="selectTab(index)"
      >
        {{ tab.props.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
import { computed, onBeforeMount, onMounted, provide, reactive, toRefs } from "vue";

export default {
  name: "UiTabs",
  setup(props, { slots }) {
    const state = reactive({
      selectedIndex: 0,
      tabs: [],
      count: 0,
    });

    provide("TabsProvider", state);

    const selectTab = (i) => {
      state.selectedIndex = i;
    };

    const classes = computed(() => ({
      "ui-tabs": true,
    }));

    /* Alternatively, in the template
       :class="{ 'ui-tabs__item': true, 'ui-tabs__item--selected': index === selectedIndex }"
       */

    const itemClasses = computed((index) => ({
      "ui-tabs__item": true,
      "ui-tabs__item--selected": index === selectedIndex,
    }));

    onBeforeMount(() => {
      if (slots.default) {
        state.tabs = slots.default().filter((child) => child.type.name === "UiTab");
      }
    });

    onMounted(() => {
      selectTab(0);
    });

    return {
      ...toRefs(state),
      classes,
      itemClasses,
      selectTab,
    };
  },
};
</script>

<style lang="scss" scoped></style>
