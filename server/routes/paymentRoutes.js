const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

const User = mongoose.model("users");
const Payment = mongoose.model("payments");
const { StripeChargeError } = require("../errors.js");

module.exports = (app) => {
  app.post("/stripe/webhook", async (req, res, next) => {
    try {
      const { body: event } = req;

      switch (event.type) {
        case "payment_intent.created":
          break;
        case "payment_intent.succeeded":
          break;
        case "charge.succeeded":
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.send({ received: true });
    } catch (e) {
      next(e);
    }
  });
  app.post(
    "/api/create-payment-intent",
    requireLogin,
    async (req, res, next) => {
      try {
        const { credits } = req.body;
        const { email, fullName, credits: balance } = await User.findOne({
          _id: req.user.id,
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: credits * 100,
          currency: "usd",
          payment_method_types: ["card"],
          receipt_email: email,
          description: `${credits} Quizdini credits for ${fullName}`,
          metadata: { balance, credits },
        });
        const { amount, currency, client_secret: clientSecret, description } =
          paymentIntent || {};
        console.log(paymentIntent);
        res.send({
          amount: currency === "usd" ? amount / 100 : amount,
          currency,
          clientSecret,
          description,
        });
      } catch (e) {
        throw new StripeChargeError(e.message, e.code);
      }
    }
  );

  /**
   * Processes Stripe payments using Stripe Elements API
   *
   * Customers purchase Quizdini credits
   * Creates Stripe charge object and serializes to payments
   * Email information sent to Stripe (for sending of receipt)
   * `credit` field in users is incremented
   *
   * @param path  Hard-coded to /api/payment
   * @param [middlewares]  Optional middleware to inject, e.g., requireLogin (forces authentication)
   * @param callback  Express callback for dealing with incoming request (req) and outgoing response (res)
   * @return Payment object
   * @throws StripeChargeError
   */
  app.post("/api/payment", requireLogin, async (req, res, next) => {
    try {
      const { tokenId, amount, credits, cardholderName } = req.body;
      const { email, fullName } = await User.findOne({ _id: req.user.id });

      // STRIPE CHARGES MUST BE EXPRESSED IN PENNIES!
      const pennies = parseInt(amount) * 100,
        description = `${credits} Quizdini credits for ${fullName}`,
        currency = "usd",
        units = "pennies";

      let charge;

      try {
        charge = await stripe.charges.create({
          amount: pennies,
          currency,
          receipt_email: email,
          description,
          source: tokenId,
          metadata: {
            credits,
            token: tokenId,
            cardholderName,
          },
        });
      } catch (e) {
        throw new StripeChargeError(e.message, e.code);
      }

      const payment = await new Payment({
        user_id: req.user.id,
        paymentId: charge.id,
        name: charge.billing_details.name,
        email: charge.receipt_email,
        description: charge.description,
        credits: parseInt(charge.metadata.credits),
        amount: charge.amount,
        currency: charge.currency,
        units,
        status: charge.status,
        paymentDate: new Date(charge.created * 1000),
        receiptUrl: charge.receipt_url,
        charge: charge,
        createDate: Date.now(),
      }).save();

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: { credits: credits },
        },
        { new: true }
      );

      console.log(
        "Credit Purchase: %s %s %s",
        user.fullName,
        payment.credits,
        payment.paymentId
      );
      const message = `${credits} credits have been added to your account.`;
      res.send({ message });
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/payment/:id", requireLogin, async (req, res, next) => {
    try {
      const payment = await Payment.findOne({
        paymentId: req.params.id,
        user_id: req.user.id,
      });

      if (!payment) return res.send({}); // Return empty Object to signify not found

      res.send(payment);
    } catch (e) {
      next(e);
    }
  });

  app.get("/api/payments", requireLogin, async (req, res, next) => {
    try {
      //throw new Error("Test payment error handling...");
      const payments = await Payment.find({ user_id: req.user.id }).sort({
        paymentDate: -1,
      });
      if (!payments) return res.send([]); // Return empty Array to signify not found
      res.send(payments);
    } catch (e) {
      next(e);
    }
  });
};
