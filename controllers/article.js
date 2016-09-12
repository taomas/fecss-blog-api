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
    // this.model.findById(id, function (err, doc) {
    //   if (err) return fn(err);
    //   if (!doc) return fn(null, false);
    //   doc.remove(function (err) {
    //       if (err) return fn(err);
    //       fn(null, true);
    //   });
    // })
  }
}

module.exports = Article;
