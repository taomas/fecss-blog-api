var mongoose = require('mongoose')

const mongooseDB = function () {
  mongoose.connect('mongodb://127.0.0.1:27017/fecss')
  return mongoose.connection
}

module.exports = mongooseDB
