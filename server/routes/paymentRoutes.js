const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

const Sequence = mongoose.model("sequence");
const User = mongoose.model("user");
const Payment = mongoose.model("payment");
const Stripe = mongoose.model("stripe");
const { StripeChargeError } = require("../errors.js");

const creditsToAmount = (
  credits = 0,
  cost = 0,
  unitCost = parseFloat(keys.creditBasePrice),
  step = parseInt(keys.creditDiscountStep),
  discountFactor = parseFloat(keys.creditDiscountFactor),
  minUnitCost = parseFloat(keys.creditMinPrice)
) => {
  if (credits === 0) return parseFloat(cost.toFixed(2));
  var t = ~~(credits / (step + 1)); // price tier
  var r = Math.max(-(unitCost * discountFactor * t) + unitCost, minUnitCost); // rate
  var u = !!(credits % step) ? credits % step : step; // units (in tier)
  return creditsToAmount(credits - u, cost + u * r); // recurse, price tier by price tier
};

module.exports = (app) => {
  app.post("/stripe/webhook", async (req, res, next) => {
    try {
      const { body: event, ip: ipAddress } = req;

      // LOG EVENT (for posterity and troubleshooting)
      await new Stripe({
        ipAddress: ipAddress.replace("::ffff:", ""),
        type: event.type,
        event,
      }).save();

      switch (event.type) {
        case "payment_intent.canceled":
          console.log("payment intent canceled...");
          break;
        case "payment_intent.succeeded":
          console.log("payment intent succeeded...");

          // DESTRUCTURE EVENT DATA
          const {
            amount,
            charges,
            created,
            currency,
            description,
            metadata: {
              balance = 0,
              credits = 0,
              customerId = null,
              orderId = null,
            },
          } = event.data.object;

          // LOOKUP CUSTOMER (using customerId from metadata)
          const { id: userId } = await User.findOne({
            customerId: parseInt(customerId),
          });

          // INSERT INTO PAYMENT TABLE
          const payment = await new Payment({
            user_id: userId,
            customerId: parseInt(customerId),
            orderId: parseInt(orderId),
            balance: parseInt(balance),
            credits: parseInt(credits),
            amount: parseInt(amount),
            currency,
            description,
            status: event.type.split(".")[1],
            paymentDate: new Date(created * 1000),
            receiptUrl: charges.data[0].receipt_url,
            charge: charges.data[0],
          }).save();

          // ADD CREDITS TO YOUR ACCOUNT
          const { credits: newBalance } = await User.findByIdAndUpdate(
            userId,
            {
              $inc: { credits: credits },
            },
            { new: true }
          );

          // OUTPUT TO LOG
          console.log(
            "Credit Purchase: %s %s %s %s",
            description,
            balance,
            "=>",
            newBalance
          );
          break;
        default:
          break;
      }
      res.send({ received: true });
    } catch (e) {
      next(e);
    }
  });

  /**
   * Processes Stripe payments using Stripe PaymentIntents API
   *
   * Customers specifies number of credits they want to purchase
   * Charge is calculated
   * PaymentIntent is registered with Stripe
   * Details needed to finalize payment, e.g., client secret, are passed back to the client
   *
   * @param path  Hard-coded to /api/payment
   * @param [middlewares]  Optional middleware to inject, e.g., requireLogin (forces authentication)
   * @param callback  Express callback for dealing with incoming request (req) and outgoing response (res)
   * @return object
   * */
  app.post("/api/payment", requireLogin, async (req, res, next) => {
    try {
      // # of credits requested
      const { credits = 0 } = req.body;

      // customer metadata (from session)
      const {
        customerId,
        email,
        fullName,
        credits: balance,
      } = await User.findOne({
        _id: req.user.id,
      });

      // generate new, unique order number
      const { seq: orderId } = await Sequence.findOneAndUpdate(
        { name: "order" },
        { $inc: { seq: 1 } },
        { returnNewDocument: true }
      );

      // register intent (on customer behalf)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(creditsToAmount(credits) * 100),
        currency: "usd",
        payment_method_types: ["card"],
        receipt_email: email,
        description: `${credits} Quizdini credits for ${fullName}`,
        metadata: {
          balance,
          credits,
          customerId,
          orderId,
        },
      });

      // destructure PaymentIntent
      const {
        amount,
        currency,
        client_secret: clientSecret,
        description,
        metadata = {},
      } = paymentIntent || {};

      // return data needed to finalize transaction, e.g., client secret, amount (in USD)
      res.send({
        amount: (amount / 100).toFixed(2),
        clientSecret,
        currency,
        description,
        ...metadata,
      });
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
