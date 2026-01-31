const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET all topics (list)
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find(
      {},
      { title: 1, slug: 1, icon: 1 }
    ).sort({ createdAt: 1 });

    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single topic by slug
router.get("/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD new topic
router.post("/", async (req, res) => {
  try {
    const { title, icon, slug, content } = req.body;

    if (!title || !slug  ) {
      return res.status(400).json({
        message: "Title and slug are required",
      });
    }

    const exists = await Topic.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Topic already exists" });
    }

    const topic = await Topic.create({
      title,
      slug,
      icon,
      content: {
        theory: content.theory || "",
        questions: content.questions || [],
        steps: content.steps || [],
      },
    });

    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
