<template>
  <div id="counter">
    Counter: {{ counter }}
    <button
      @click="
        increment();
        c = counter;
      "
    >
      Increment
    </button>
    <button
      @click="
        incrementCounter();
        c = counter;
      "
    >
      Increment (using Mutation)
    </button>
    <button
      @click="
        reset();
        c = 0;
      "
    >
      Reset
    </button>
    <input
      v-model="c"
      type="number"
      step="5"
      min="1"
      max="1000"
      @change.prevent="onInputChange"
    />
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore, mapMutations, mapActions } from "vuex";
export default {
  name: "Counter",
  setup() {
    const store = useStore();
    const counter = computed(() => store.getters["test/counter"]);
    const increment = () => store.dispatch("test/updateCounter");
    const reset = () => store.dispatch("test/resetCounter");
    //const setCounter = (payload) => store.dispatch("test/setCounter", payload);
    return {
      counter,
      increment,
      reset,
      //setCounter,
      ...mapActions("test", ["setCounter"]),
      ...mapMutations("test", ["incrementCounter"]),
    };
  },
  data: function () {
    return {
      c: 0,
    };
  },
  methods: {
    onInputChange() {
      this.setCounter({ counter: this.c });
    },
  },
};
</script>

<style lang="scss" scoped></style>
