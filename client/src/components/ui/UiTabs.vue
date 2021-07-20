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

    const itemClasses = computed(() => (index) => ({
      "ui-tabs__item": true,
      "ui-tabs__item--selected": index === state.selectedIndex,
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

<style lang="scss" scoped>
.ui-tabs {
  $tabs: &;
  $header: #{$tabs}__header;
  $items: #{$tabs}__item;
  &__header {
    display: block;
    list-style: none;
    margin: 1rem 1rem 0;
    padding: 0;
  }
  @at-root #{$tabs} #{$header} #{$items}--selected {
    font-weight: bold;
    border-radius: 0.75rem 0.75rem 0 0;
    border-bottom: 0.5rem solid transparent;
    background-color: #fff;
    color: #001399;
  }
  @at-root #{$header} > #{$items} {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    margin: 0;
    display: inline-block;
    margin-right: 0.5rem;
    cursor: pointer;
    background-color: #ddd;
    color: #aaa;
  }
}
</style>
