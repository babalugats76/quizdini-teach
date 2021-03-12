<template>
  <div class="credit">
    <div class="credit__form" :style="{ textAlign: 'center ' }">
      <div class="credit__picker">
        <span class="credit__decrement" @click="decrement()">–</span>
        <input
          ref="creditsRef"
          v-model="credits"
          class="credit__input"
          disabled
          type="text"
          min="0"
          max="50"
        />
        <span class="credit__increment" @click="increment()">+</span>
      </div>
      <span class="credit__total">${{ amount }}</span
      ><br />
      <span class="credit__unit-price"
        >${{ credits ? (amount / credits).toFixed(2) : 0.0 }}</span
      >
    </div>
    <checkout-form v-if="false" :credits="credits" />
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { CheckoutForm } from "@/components/";

export default {
  name: "CreditForm",
  components: {
    CheckoutForm,
  },
  setup() {
    const creditsRef = ref();

    const state = reactive({
      amount: 0,
      credits: 0,
    });

    const creditsToAmount = (
      credits = 0,
      cost = 0,
      unitCost = parseFloat(process.env.VUE_APP_CREDIT_BASE_PRICE),
      step = parseInt(process.env.VUE_APP_CREDIT_DISCOUNT_STEP),
      discountFactor = parseFloat(process.env.VUE_APP_CREDIT_DISCOUNT_FACTOR),
      minUnitCost = parseFloat(process.env.VUE_APP_CREDIT_MIN_PRICE)
    ) => {
      if (credits === 0) return cost.toFixed(2);
      var t = ~~(credits / (step + 1)); // price tier
      var r = Math.max(
        -(unitCost * discountFactor * t) + unitCost,
        minUnitCost
      ); // rate
      var u = !!(credits % step) ? credits % step : step; // units (in tier)
      return creditsToAmount(credits - u, cost + u * r); // recurse, price tier by price tier
    };

    const decrement = () => {
      state.credits = Math.max(state.credits - 1, creditsRef.value.min);
      state.amount = creditsToAmount(state.credits);
    };

    const increment = () => {
      state.credits = Math.min(state.credits + 1, creditsRef.value.max);
      console.log(state.credits);
      console.log(creditsToAmount(state.credits));
      state.amount = creditsToAmount(state.credits);
    };

    return {
      creditsRef,
      decrement,
      increment,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.credit {
  &__picker {
    font-size: 1.5rem;
  }
  &__input {
    display: inline-block;
    width: 5em;
    padding: 0 0.75rem;
    font-size: 1.25em;
    text-align: center;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
    &:disabled {
      background-color: white;
    }
  }
  &__increment,
  &__decrement {
    display: inline-block;
    width: 3em;
    padding: 0 0.75rem;
    font-size: 1em;
    text-align: center;
    font-weight: bold;
    background: white;
    color: #444;
    border-radius: 0.25em;
    border: 1px solid grey;
    box-shadow: 1px 1px 1px grey;
    white-space: nowrap;
    cursor: pointer;
    &:active {
      background-color: #ddd;
    }
  }
}
</style>
