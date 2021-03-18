const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true }, // Manual reference (like a foreign key)
    orderId: { type: Number }, // Unique id from payment processor (from metadata)
    balance: { type: Number }, // previous balance in terms of credits before purchase (from metadata)
    credits: { type: Number }, // credits (from metadata)
    amount: { type: Number }, // in pennies (Stripe convention)
    currency: { type: String }, // See: https://www.iso.org/iso-4217-currency-codes.html
    description: { type: String }, // e.g., 11 Quizdini credits for James Colestock
    status: { type: String }, // second part of Stripe event, e.g., payment_intent.succeeded --> succeeded
    paymentDate: { type: Date }, // event.created (seconds since epoch converted to Date object)
    receiptUrl: { type: String }, // only if there is a charge, e.g., `payment_intent.succeeded`
    charge: { type: Schema.Types.Mixed }, // Reserved (when processor is Stripe)
    units: { type: String, default: "cents" }, // used for formatting / preparation for how things may change in future
    processor: { type: String, default: "Stripe" }, // preparation for how things may change in future
    createDate: { type: Date, default: Date.now, required: true }, // create date/time
  },
  {
    id: false,
    toObject: {
      getters: true,
      virtuals: true,
      versionKey: false,
      minimize: false,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.charge;
      },
    },
    toJSON: {
      getters: true,
      virtuals: true,
      versionKey: false,
      minimize: false,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.charge;
      },
    },
  }
);

paymentSchema.virtual("amountFormatted").get(function () {
  if (
    this.units.toLowerCase() === "cents" &&
    this.currency.toLowerCase() === "usd"
  ) {
    return Number(this.amount / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  return "$0.00";
});

mongoose.model("payment", paymentSchema, "payments");
