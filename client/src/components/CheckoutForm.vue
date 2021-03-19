<template>
  <div class="checkout">
    <input type="button" value="<-- Back" @click="onBack" />
    <div v-show="stripeReady">
      <ui-form
        v-if="scriptLoaded && accountLoaded && countriesLoaded"
        ref="checkoutFormRef"
        :initial-values="initialValues"
        :schema="checkoutFormSchema"
        tag="div"
        class="checkout__form"
        @submit="handleSubmit"
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
          <div v-if="!dirty && message">{{ message }}</div>
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
          <fieldset class="checkout__card-info">
            <label>Card Information</label>
            <div class="form-input">
              <div id="card-number" ref="cardNumberRef"></div>
            </div>
            <div class="form-input">
              <div id="card-expiry" ref="cardExpiryRef"></div>
            </div>
            <div class="form-input">
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
            <ui-datalist
              id="countries"
              v-model:value="values.country"
              v-model:code="values.countryCode"
              autocomplete="country-name"
              :options="countries"
              label="Country"
              name="country"
              :errors="touched.country && errors.country"
              tabindex="5"
              :disabled="submitting"
              @blur="blur"
              @input="input"
            />
          </div>
          <div
            v-if="values.countryCode === 'US' || values.countryCode === 'GB'"
            class="form-input"
          >
            <ui-input
              v-model:value="values.postalCode"
              autocomplete="postal-code"
              :errors="touched.postalCode && errors.postalCode"
              :label="
                values.countryCode === 'US'
                  ? 'Zip Code (5-digit)'
                  : 'Postal Code'
              "
              name="postalCode"
              type="text"
              :disabled="submitting"
              :maxlength="values.countryCode === 'US' ? 5 : 8"
              @blur="blur"
              @input="input"
            />
          </div>
          <div class="form-input">
            <button @click.prevent="handleSubmit">Pay now</button>
          </div>
        </template>
      </ui-form>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { number, object, string } from "yup";

import useScript from "@/compose/useScript";
import { postPayment } from "@/api/payments";

import UiButton from "@/components/ui/UiButton";
import UiDatalist from "@/components/ui/UiDatalist";
import UiForm from "@/components/ui/UiForm";
import UiInput from "@/components/ui/UiInput";

import useAccount from "@/compose/useAccount";
import useCountries from "@/compose/useCountries";

export default {
  name: "CheckoutForm",
  components: {
    //  UiButton,
    UiDatalist,
    UiForm,
    UiInput,
  },
  props: ["credits"],
  emits: ["back"],
  setup(props, { emit }) {
    const cardCvcRef = ref();
    const cardExpiryRef = ref();
    const cardNumberRef = ref();
    const checkoutFormRef = ref();

    const router = useRouter();

    const {
      email = null,
      countryCode = "",
      loaded: accountLoaded,
    } = useAccount();
    const { options: countries, loaded: countriesLoaded } = useCountries();

    const state = reactive({
      amount: 0,
      cardCvc: null,
      cardExpiry: null,
      cardNumber: null,
      clientSecret: "",
      currency: "",
      description: "",
      message: "",
      stripe: null,
      stripeReady: false,
    });

    const onBack = () => emit("back");

    const checkoutFormSchema = object({
      credits: number().required(""),
      cardholderName: string().required("Cardholder Name is required"),
      country: string().required("Country is required"),
      postalCode: string()
        .when("countryCode", {
          is: (val) => val === "US",
          then: string().matches(/^\d{5}$/, "Invalid zip code"),
        })
        .when("countryCode", {
          is: (val) => val === "GB",
          then: string().matches(
            /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
            "Invalid postcode"
          ),
        }),
    });

    const initialValues = reactive({
      cardholderName: "",
      country: computed(() => {
        const { text = "" } =
          countries.value.find((c) => c.value === countryCode.value) || {};
        return text;
      }),
      countryCode: countryCode,
      credits: props.credits,
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
      return postPayment({ credits: props.credits })
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
          // secret key is returns (if intent successful)
          state.clientSecret = data.clientSecret;
          state.amount = data.amount;
          state.currency = data.currency;
          state.description = data.description;

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
        })
        .catch((err) => {
          console.error(err);
        });
    };

    watch(
      [scriptLoaded, accountLoaded, countriesLoaded],
      (
        [scriptLoaded, accountLoaded, countriesLoaded],
        [prevScriptLoaded, prevAccountLoaded, prevCountriesLoaded]
      ) => {
        if (scriptLoaded && accountLoaded && countriesLoaded) {
          state.stripe = Stripe(process.env.VUE_APP_STRIPE_KEY);
          prepareStripe();
        }
      },
      { immediate: true }
    );

    const handleSubmit = async ({
      errors,
      setSubmitting,
      setSubmitted,
      values,
    }) => {
      if (errors) return;
      state.message = "";
      setSubmitting();
      state.stripe
        .confirmCardPayment(state.clientSecret, {
          payment_method: {
            // according to Stripe, any mounted element can be provided for 'card'
            card: state.cardNumber,
            billing_details: {
              address: {
                postal_code: values.countryCode,
                ...(values.postalCode && { postal_code: values.postalCode }),
              },
              name: values.cardholderName,
              email: values.email,
            },
            type: "card",
          },
        })
        .then((res) => {
          const { error, paymentIntent } = res || {};
          if (paymentIntent && paymentIntent.status === "succeeded") {
            // console.log(JSON.stringify(paymentIntent, null, 4));
            // call api that adds credits to account

            setTimeout(() => {
              router.push({
                name: "Profile",
                params: {
                  message: `$${paymentIntent.amount} ==> ${paymentIntent.description}`,
                },
              });
            }, 3000);
          } else {
            const { message = "" } = error || {};
            state.message = "Payment failed: " + message;
            throw new Error(message);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setSubmitted();
        });
    };

    const { clientSecret, ...rest } = toRefs(state);

    return {
      accountLoaded,
      countriesLoaded,
      cardCvcRef,
      cardExpiryRef,
      cardNumberRef,
      checkoutFormRef,
      checkoutFormSchema,
      countries,
      handleSubmit,
      onBack,
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

.checkout__card-info {
  box-shadow: 0 1px 3px 0 rgb(50 50 93 / 15%),
    0 4px 6px 0 rgb(112 157 199 / 15%);
}

.checkout__card-info .form-input:not(:last-child) {
  border-bottom: 1px solid #f0f5fa;
}

.StripeElement {
  padding: 0.5rem 0.75rem;
  // outline: 1px solid gray;
  transition: none !important;
}
</style>
