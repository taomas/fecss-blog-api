'use strict'
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
