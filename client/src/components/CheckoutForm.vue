<template>
  <div class="checkout">
    <ui-form
      v-show="scriptLoaded && stripeReady"
      ref="checkoutFormRef"
      :initial-values="initialValues"
      :schema="checkoutFormSchema"
      tag="div"
      class="checkout__form"
    >
      <template
        #default="{
          blur,
          dirty,
          errors,
          handleSubmit,
          hasErrors,
          input,
          submitting,
          touched,
          values,
        }"
      >
        <div class="form-input">
          <ui-input
            v-model:value="values.email"
            autocomplete="email"
            :errors="touched.email && errors.email"
            label="Email"
            name="email"
            type="email"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <fieldset>
          <label>Card Information</label>
          <div class="form-input">
            <div id="card-number" ref="cardNumberRef"></div>
          </div>
          <div class="form-input">
            <div id="card-expiry" ref="cardExpiryRef"></div>
            <div id="card-cvc" ref="cardCvcRef"></div>
          </div>
        </fieldset>
        <div class="form-input">
          <ui-input
            v-model:value="values.cardholderName"
            name="cardholder-name"
            autocomplete="cc-name"
            :errors="touched.cardholderName && errors.cardholderName"
            label="Name on card"
            tabindex="1"
            type="text"
            :disabled="submitting"
            @blur="blur"
            @input="input"
          />
        </div>
        <div class="form-input">
          <ui-button size="lg">Pay now</ui-button>
        </div>
      </template>
    </ui-form>
  </div>
</template>

<script>
import { reactive, ref, toRefs, watch } from "vue";
import { number, object, string } from "yup";

import useScript from "@/compose/useScript";
import { postPaymentIntent } from "@/api/payment";

import UiButton from "@/components/ui/UiButton";
import UiForm from "@/components/ui/UiForm";
import UiInput from "@/components/ui/UiInput";

import useAccount from "@/compose/useAccount";
import useCountries from "@/compose/useCountries";

export default {
  name: "CheckoutForm",
  components: {
    UiButton,
    UiForm,
    UiInput,
  },
  props: ["credits"],
  setup(props) {
    const cardCvcRef = ref();
    const cardExpiryRef = ref();
    const cardNumberRef = ref();
    const checkoutFormRef = ref();

    const { email = null } = useAccount();
    const { countries } = useCountries();

    const state = reactive({
      amount: 0,
      cardCvc: null,
      cardExpiry: null,
      cardNumber: null,
      clientSecret: "",
      currency: "",
      stripe: null,
      stripeReady: false,
    });

    const checkoutFormSchema = object({
      credits: number().required(""),
      cardholderName: string().required("Cardholder Name is required"),
    });

    const initialValues = reactive({
      credits: props.credits,
      cardholderName: "",
      email: email,
    });

    const { loaded: scriptLoaded, error: scriptError } = useScript(
      process.env.VUE_APP_STRIPE_SCRIPT,
      {
        async: true,
        onload: () => console.log("stripe loaded..."),
      }
    );

    const stripeStyles = () => ({
      base: {
        iconColor: "#c4f0ff",
        color: "#000",
        fontWeight: "500",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#000",
        },
        "::placeholder": {
          color: "#ccc",
        },
      },
      invalid: {
        iconColor: "#FFC7EE",
        color: "#FFC7EE",
      },
    });

    const prepareStripe = () => {
      console.log("Preparing Stripe...");
      // create payment intent
      return postPaymentIntent({ credits: props.credits })
        .then((res) => {
          const { error, data } = res || {};
          if (error) {
            switch (data.code) {
              case "StripeChargeError":
                throw new Error("StripeChargeError");
              default:
                throw new Error("PaymentIntentFailed");
            }
          }
          return data;
        })
        .then((data) => {
          console.log("data returned from intent...");
          console.log(data);

          // secret key is returns (if intent successful)
          state.clientSecret = data.clientSecret;
          state.amount = parseInt(data.amount);
          state.currency = data.currency;

          // initialize Stripe elements
          const elements = state.stripe.elements();

          // create the Stripe card elements
          const cardCvc = elements.create("cardCvc", {
            placeholder: "CVC",
            style: stripeStyles(),
          });
          state.cardCvc = cardCvc;

          const cardNumber = elements.create("cardNumber", {
            showIcon: true,
            style: stripeStyles(),
          });
          state.cardNumber = cardNumber;

          const cardExpiry = elements.create("cardExpiry", {
            placeholder: "MM/YY",
            style: stripeStyles(),
          });
          state.cardExpiry = cardExpiry;

          // mount elements (get ids from ref)
          cardCvc.mount(`#${cardCvcRef.value.id}`);
          cardNumber.mount(`#${cardNumberRef.value.id}`);
          cardExpiry.mount(`#${cardExpiryRef.value.id}`);

          state.stripeReady = true;
          // form.addEventListener("submit", function (event) {
          //   event.preventDefault();
          //   // Complete payment when the submit button is clicked
          //   payWithCard(stripe, card, data.clientSecret);
          // });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    watch(
      scriptLoaded,
      (scriptLoaded, prevScriptLoaded) => {
        if (scriptLoaded) {
          state.stripe = Stripe(process.env.VUE_APP_STRIPE_KEY);
          prepareStripe();
        }
      },
      { immediate: true }
    );

    const { clientSecret, ...rest } = toRefs(state);

    return {
      cardCvcRef,
      cardExpiryRef,
      cardNumberRef,
      checkoutFormRef,
      checkoutFormSchema,
      initialValues,
      scriptError,
      scriptLoaded,
      ...rest,
    };
  },
};
</script>

<style lang="scss" scoped>
.checkout {
  max-width: 380px;
  margin: 0 auto;
}
.StripeElement {
  padding: 0.5rem 0.75rem;
}
</style>
