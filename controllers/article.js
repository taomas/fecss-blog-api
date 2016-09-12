'use strict'

const ArticleModel = require('../models/article');

class Article {
  constructor () {
    this.model = ArticleModel;
  }
  save (opts) {
    this.entity = new ArticleModel(opts);
    return this.entity.save(opts);
  }
  query (opts) {
    return this.model.find(opts)
    .sort({ date: -1 })
  }
}

module.exports = Article;
