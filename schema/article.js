'use strict'
var mongoose = require('mongoose');
var moment = require('moment');

var articleSchema = new mongoose.Schema({
  title: String,
  tags: String,
  sourceArticle: String,
  markedArticle: String,
  createTime: { type: String, default: moment().format('YYYY-MM-DD')}
});

module.exports = mongoose.model('Article', articleSchema);
