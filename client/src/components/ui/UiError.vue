<template>
  <div>
    <ul v-for="(error, i) in errors" :key="i">
      <li v-if="error">{{ error }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "UiError",
  props: {
    errors: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
};
</script>
