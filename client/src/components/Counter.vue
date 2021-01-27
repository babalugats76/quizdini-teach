<template>
  <div id="counter">
    Counter: {{ counter }}
    <button @click="increment">Increment</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "Counter",
  setup() {
    const store = useStore();
    const counter = computed(() => store.getters["test/counter"]);
    const increment = () => store.dispatch("test/updateCounter");
    const reset = () => store.dispatch("test/resetCounter");
    return {
      counter,
      increment,
      reset,
    };
  },
};
</script>

<style lang="scss" scoped></style>
