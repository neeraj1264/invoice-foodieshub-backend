const express = require("express");
const TopicReview = require("../models/TopicReview");
const Topic = require("../models/Topic");

const router = express.Router();

// ➕ Submit for review
router.post("/", async (req, res) => {
  try {
    const review = await TopicReview.create(req.body);
    res.status(201).json({ message: "Submitted for review" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📋 Get all pending reviews
router.get("/", async (req, res) => {
  const reviews = await TopicReview.find({ status: "pending" });
  res.json(reviews);
});

// ✅ Approve review
router.post("/:id/approve", async (req, res) => {
  const review = await TopicReview.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Not found" });

  await Topic.create({
    title: review.title,
    slug: review.slug,
    icon: review.icon,
    content: review.content,
  });

  review.status = "approved";
  await review.save();

  res.json({ message: "Topic approved & published" });
});

// ❌ Reject review
router.post("/:id/reject", async (req, res) => {
  await TopicReview.findByIdAndDelete(req.params.id);
  res.json({ message: "Topic rejected" });
});

module.exports = router;
