<template>
  <div :class="classes">
    <ul class="ui-tab-menu__header">
      <li class="ui-tab-menu__item" v-for="tab in tabs" :key="tab.props.title">
        {{ tab.props.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UiTabMenu",
  data() {
    return {
      selectedIndex: 0, // the index of the selected tab,
      tabs: [], // all of the tabs
    };
  },
  created() {
    this.tabs = this.$slots.default().filter((child) => child.type.name === "UiTab");
  },
  computed: {
    classes() {
      return {
        "ui-tab-menu": true,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
