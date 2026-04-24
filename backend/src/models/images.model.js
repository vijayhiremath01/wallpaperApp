const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: "General",
      index: true
    },
    downloads: {
      type: Number,
      default: 0,
      index: true
    }
  },
  { timestamps: true }
);

imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Image", imageSchema);


// Image model 