'use strict'

const ArticleModel = require('../models/article');

class Article {
  constructor () {
    this.model = ArticleModel;
  }
  save (opts) {
    console.log(opts);
    this.entity = new ArticleModel(opts);
    return this.entity.save(opts);
  }
  query (opts) {
    return this.model.find(opts)
    .sort({ _id: -1 })
    .exec()
  }
  queryAll () {
    return this.model.find({})
    .sort({ _id: -1 })
    .exec()
  }
  queryById (id) {
    console.log(id)
    return this.model.findById(id)
  }
  remove (id, fn) {
    return this.model.findById(id).then(function (doc) {
      if (!doc) return fn(null, false);
      return doc.remove();
    })
  }
}

module.exports = Article;
