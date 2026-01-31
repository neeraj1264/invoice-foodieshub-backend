const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
);

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    icon: {
      type: String,
    },

    content: {
      theory: {
        type: String,
      },

      questions: {
        type: [questionSchema],
        default: [],
      },

      steps: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
