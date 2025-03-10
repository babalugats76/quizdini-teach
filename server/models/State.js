const mongoose = require("mongoose");
const { Schema } = mongoose;

const stateSchema = new Schema(
  {
    stateCode: { type: String, required: true },
    stateName: { type: String, required: true },
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

mongoose.model("state", stateSchema, "states");
