const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  notes: { type: String },
  language: { type: String, required: true },
  tags: [{ type: String, required: true }],
  timestamp: { type: String, required: true }
})

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
