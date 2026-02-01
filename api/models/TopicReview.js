const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const topicReviewSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    icon: String,
    content: {
      theory: String,
      questions: [questionSchema],
      steps: [String],
    },
    status: {
      type: String,
      default: "pending", // pending | approved | rejected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopicReview", topicReviewSchema);
