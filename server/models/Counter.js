const mongoose = require("mongoose");
const { Schema } = mongoose;

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
  },
  {
    id: false,
    toObject: {
      getters: true,
      virtuals: true,
      versionKey: false,
      minimize: false,
    },
    toJSON: {
      getters: true,
      virtuals: true,
      versionKey: false,
      minimize: false,
    },
  }
);

mongoose.model("counters", counterSchema);
