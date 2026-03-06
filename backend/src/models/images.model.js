const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },

    downloads: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;