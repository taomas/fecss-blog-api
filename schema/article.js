'use strict'
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
  title: String,
  tags: String,
  sourceArticle: String,
  markedArticle: String,
  createTime: String
});

module.exports = mongoose.model('Article', articleSchema);
