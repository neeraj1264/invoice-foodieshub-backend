const Topic = require('../models/Topic');
const express = require('express');
const router = express.Router();

// GET all topics
export const getTopics = async (req, res) => {
  const topics = await Topic.find().sort({ createdAt: 1 });
  res.json(topics);
};

// ADD new topic
export const addTopic = async (req, res) => {
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
};

router.get("/", getTopics);
router.post("/", addTopic);

export default router;
