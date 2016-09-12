'use strict'
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  tags: String,
  title: String,
  content: String,
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
