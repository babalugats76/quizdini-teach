const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: { type: Number }, // Unique id from payment processor (from metadata)
    balance: { type: Number }, // New balance (upon update of user record)
    credits: { type: Number }, // Credits purchased (from metadata)
    amount: { type: Number }, // in pennies (Stripe convention)
    currency: { type: String }, // See: https://www.iso.org/iso-4217-currency-codes.html
    description: { type: String }, // e.g., 11 Quizdini credits for James Colestock
    type: {
      type: String,
      enum: ["CHARGE", "REFUND"],
      default: "CHARGE",
    }, // context of row is based upon whether based on a purchase or refund thereof
    receiptUrl: { type: String }, // only if there is a charge, e.g., `payment_intent.succeeded`
    charge: { type: Schema.Types.Mixed }, // payment details object; specific to the type, e.g., charge (+), refund (-)
    chargeDate: { type: Date }, // event.created (seconds since epoch converted to Date object)
    units: { type: String, default: "cents" }, // used for formatting / preparation for how things may change in future
    processor: { type: String, default: "Stripe" }, // preparation for how things may change in future
    createDate: { type: Date, default: Date.now, required: true }, // create date/time (when event was received)
    user_id: { type: Schema.Types.ObjectId, required: true }, // Manual reference (like a foreign key)
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
  var formatted = "$0.00";
  if (
    this.units.toLowerCase() === "cents" &&
    this.currency.toLowerCase() === "usd"
  ) {
    formatted = Number(this.amount / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return this.type === "REFUND" ? `(${formatted})` : formatted;
  }
  return formatted;
});

paymentSchema.virtual("creditsFormatted").get(function () {
  return this.type === "REFUND" ? `(${this.credits})` : this.credits;
});

mongoose.model("payment", paymentSchema, "payments");
