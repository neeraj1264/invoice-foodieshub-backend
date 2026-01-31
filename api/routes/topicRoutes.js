const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

// GET all topics
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD new topic
const addTopic = async (req, res) => {
  try {
    const { title, icon, slug, pdf } = req.body;

    const exists = await Topic.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Topic already exists" });
    }

    const topic = await Topic.create({
      title,
      icon,
      slug,
      pdf,
    });

    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.get("/", getTopics);
router.post("/", addTopic);

module.exports = router;
