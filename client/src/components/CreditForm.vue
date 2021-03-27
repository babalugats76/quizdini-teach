<template>
  <div class="credit">
    <div v-show="!checkout" key="credits" class="credit__form" :style="{ textAlign: 'center ' }">
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
      <span class="credit__total">${{ parseFloat(amount).toFixed(2) }}</span
      ><br />
      <span class="credit__unit-price"
        >${{ credits ? (amount / credits).toFixed(2) : 0.0 }} per credit</span
      ><br />
      <input
        type="button"
        :value="`Buy ${credits} credits`"
        :disabled="credits <= 0"
        class="credit__checkout"
        @click="toggleCheckout()"
      />
    </div>
    <checkout-form v-if="checkout" key="checkout" :credits="credits" @back="toggleCheckout()" />
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
      checkout: false,
    });

    const toggleCheckout = () => {
      state.checkout = !state.checkout;
    };

    const creditsToAmount = (
      credits = 0,
      cost = 0,
      unitCost = parseFloat(process.env.VUE_APP_CREDIT_BASE_PRICE),
      step = parseInt(process.env.VUE_APP_CREDIT_DISCOUNT_STEP),
      discountFactor = parseFloat(process.env.VUE_APP_CREDIT_DISCOUNT_FACTOR),
      minUnitCost = parseFloat(process.env.VUE_APP_CREDIT_MIN_PRICE)
    ) => {
      if (credits === 0) return parseFloat(cost.toFixed(2));
      var t = ~~(credits / (step + 1)); // price tier
      var r = Math.max(-(unitCost * discountFactor * t) + unitCost, minUnitCost); // rate
      var u = !!(credits % step) ? credits % step : step; // units (in tier)
      return creditsToAmount(credits - u, cost + u * r); // recurse, price tier by price tier
    };

    const decrement = () => {
      state.credits = Math.max(state.credits - 1, creditsRef.value.min);
      state.amount = creditsToAmount(state.credits);
    };

    const increment = () => {
      state.credits = Math.min(state.credits + 1, creditsRef.value.max);
      state.amount = creditsToAmount(state.credits);
    };

    return {
      creditsRef,
      decrement,
      increment,
      toggleCheckout,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.credit {
  &__picker {
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  &__input {
    max-width: 180px;
    padding: 0 0.75rem;
    font-size: 2em;
    @include font("Montserrat", "extra-bold");
    text-align: center;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
    overflow: hidden;
    pointer-events: none;
    &:disabled {
      background-color: white;
    }
  }
  &__increment,
  &__decrement {
    padding: 0 0.75rem;
    font-size: 1em;
    @include font("Montserrat", "bold");
    text-align: center;
    font-weight: bold;
    background: white;
    color: #444;
    border-radius: 0.25em;
    box-shadow: 1px 1px 1px grey;
    white-space: nowrap;
    overflow: visible;
    z-index: 2;
    cursor: pointer;
    &:active {
      background-color: #ddd;
    }
  }
  &__total {
    font-size: 2em;
  }
  &__checkout {
    padding: 0.25rem 0.75rem;
    margin-top: 1rem;
  }
}
</style>
