const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  owner: { type: String, required: true, lowercase: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  notes: { type: String },
  language: { type: String, required: true, lowercase: true },
  tags: [{ type: String, required: true, lowercase: true }],
  timestamp: { type: Date, required: true, default: Date.now },
  favoritedBy: [{ type: String }]
})

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
