const mongoose = require("mongoose");
const { Schema } = mongoose;

const stripeSchema = new Schema(
  {
    ipAddress: { type: String }, // Posting server remote address
    type: { type: String }, // See: https://stripe.com/docs/api/events/types
    event: Schema.Types.Mixed, // Payload from Stripe
    logDate: { type: Date, default: Date.now, required: true }, // When event was received
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
      },
    },
    toJSON: {
      getters: true,
      virtuals: true,
      versionKey: false,
      minimize: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

mongoose.model("stripe", stripeSchema, "stripe");
