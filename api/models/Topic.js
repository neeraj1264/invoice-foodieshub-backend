const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    pdf: { type: String, required: true },
  });

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
