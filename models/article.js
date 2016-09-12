'use strict'
var mongoose = require('mongoose');
var moment = require('moment');
// moment.locale('zh-cn');

var articleSchema = new mongoose.Schema({
  tags: String,
  title: String,
  content: String,
  createTime: { type: String, default: moment().format('YYYY-MM-DD')}
});

module.exports = mongoose.model('Article', articleSchema);
