'use strict'

const UserModel = require('../schema/user');

class User {
  constructor () {
    this.model = UserModel;
  }
  save (opts, fn) {
    this.entity = new UserModel(opts)
    return this.entity.save(opts)
  }
  query (opts) {
    return this.model.find(opts).exec()
  }
  queryAll () {
    return this.model.find({}).exec()
  }
  removeAll () {
    return this.model.remove({})
  }
}

module.exports = User
