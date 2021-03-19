const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

const Sequence = mongoose.model("sequence");
const User = mongoose.model("user");
const Payment = mongoose.model("payment");
const Stripe = mongoose.model("stripe");
// const { StripeChargeError } = require("../errors.js");

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

      // LOG EVENT
      await new Stripe({
        ipAddress: ipAddress.replace("::ffff:", ""),
        type: event.type,
        event,
      }).save();

      console.log("Stripe webhook received %s", event.type);

      switch (event.type) {
        case "payment_intent.succeeded":
          // DESTRUCTURE EVENT DATA
          var {
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

          // LOOKUP CUSTOMER & ADD CREDITS
          var { credits: newBalance, id: userId } = await User.findOneAndUpdate(
            { customerId: parseInt(customerId) },
            {
              $inc: { credits: parseInt(credits) },
            },
            { new: true }
          );

          // INSERT INTO PAYMENT TABLE
          await new Payment({
            user_id: userId,
            orderId: parseInt(orderId),
            balance: parseInt(newBalance),
            credits: parseInt(credits),
            amount: parseInt(amount),
            currency,
            description,
            receiptUrl: charges.data[0].receipt_url, // should only be one charge, so index 0 is used
            status: event.type.split(".")[1], // grab just content after period
            charge: charges.data[0], // charge if positive and refund if negative
            chargeDate: new Date(created * 1000), // convert to microseconds before casting
          }).save();

          // OUTPUT TO LOG
          console.log(
            "Purchase: %s %s %s %s",
            description,
            balance,
            "=>",
            newBalance
          );
          break;
        case "charge.refunded":
          // DESTRUCTURE EVENT DATA
          var {
            amount, // original amount
            amount_refunded, // vs. refund amount
            created,
            currency,
            metadata: { credits = 0, customerId = null, orderId = null },
            receipt_url,
            refunds,
          } = event.data.object;

          // LOOKUP CUSTOMER (using customerId from metadata)
          var { id: userId, credits: balance, fullName } = await User.findOne({
            customerId: parseInt(customerId),
          });

          // DETERMINE # CREDITS TO CLAW BACK
          const creditsToRefund = parseInt(
            amount === amount_refunded ? credits : 0
          );

          // LOOKUP CUSTOMER & CLAWBACK CREDITS
          var { credits: newBalance } = await User.findByIdAndUpdate(
            userId,
            {
              $inc: { credits: -1 * creditsToRefund },
            },
            { new: true }
          );

          // INSERT INTO PAYMENT TABLE
          await new Payment({
            user_id: userId,
            type: "REFUND",
            orderId: parseInt(orderId), // refers to original purchase
            balance: parseInt(newBalance), // after any applicable credits are clawed back
            credits: creditsToRefund, // refunded credits
            amount: parseInt(amount_refunded), // of refund (int because stored in cents)
            currency,
            description: "Refund issued",
            receiptUrl: receipt_url, //charge object store this at a "higher" level (at base object level)
            charge: refunds.data[0], // will contain refund if type is 'charge.refunded'
            chargeDate: new Date(created * 1000), // convert to microseconds before casting
          }).save();

          // OUTPUT TO LOG
          console.log(
            "Refund: %s %s %s %s",
            `${Number(parseInt(amount_refunded) / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })} refunded to ${fullName}`,
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
  app.post("/api/payments", requireLogin, async (req, res, next) => {
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

  app.get("/api/payments/:id", requireLogin, async (req, res, next) => {
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
        chargeDate: -1,
      });
      if (!payments) return res.send([]); // Return empty Array to signify not found
      res.send(payments);
    } catch (e) {
      next(e);
    }
  });
};
