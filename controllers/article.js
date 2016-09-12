'use strict'

const ArticleModel = require('../models/article');

class Article {
  constructor () {
    this.model = ArticleModel;
  }
  save (opts, fn) {
    this.entity = new ArticleModel(opts);
    this.entity.save(opts, function (err, updateEntity) {
      if (err) return fn(err)
      fn(updateEntity)
    });
  }
  query (opts, fn) {
    this.model.find(opts)
    .sort({ date: -1 })
    .exec(function (err, doc) {
      if (err) { return err }
      fn(doc)
    })
  }
}

module.exports = Article;
