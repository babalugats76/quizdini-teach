const mongoose = require("mongoose");
const { Schema } = mongoose;

const sequenceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    id: true,
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

mongoose.model("sequences", sequenceSchema);
