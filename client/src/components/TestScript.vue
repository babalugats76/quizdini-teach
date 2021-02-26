<template>
  <div>
    <h1>Script Tester</h1>
    <p>{{ loaded }}</p>
    <p>{{ error }}</p>
    <form ref="paymentForm">
      <div id="card-element" ref="cardElement"></div>
      <button :disabled="!loaded" @click.prevent="checkout">Checkout</button>
    </form>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import useScript from "@/compose/useScript";
import { postPaymentIntent } from "@/api/payment";

export default {
  setup() {
    const stripe = ref();
    const paymentForm = ref();
    const cardElement = ref();
    const credits = 10;
    const { loaded, error } = useScript(process.env.VUE_APP_STRIPE_SCRIPT, {
      async: true,
      onload: () => console.log("stripe loaded..."),
    });

    const checkout = () => {
      return postPaymentIntent({ credits: credits.value })
        .then((res) => {
          const { error, data } = res || {};
          return data;
        })
        .then((data) => {
          console.log(data);
          var elements = stripe.value.elements();
          console.log(elements);
          var card = elements.create("card" /* { style: style } */);
          // Stripe injects an iframe into the DOM
          console.log(cardElement.value);
          cardElement.value.innerHTML = "";
          console.log(cardElement.value.id);
          card.mount(`#${cardElement.value.id}`);
        });
    };

    watch(loaded, (loaded, prevLoaded) => {
      console.log("watch fired", loaded, "vs", prevLoaded);
      stripe.value = Stripe(process.env.VUE_APP_STRIPE_KEY);
      console.log(stripe.value);
    });

    return {
      checkout,
      paymentForm,
      cardElement,
      loaded,
      error,
      stripe,
    };
  },
};
</script>

<style lang="scss" scoped></style>
