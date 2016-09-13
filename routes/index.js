var router = require('koa-router')()
var Article = require('../controllers/article')

var article = new Article()

function splitDoc (doc, start, limit) {
  var startIndex = +start,
    endIndex = (start + 1) * limit;
  var results = []
  console.log(endIndex)
  for (var i = 0; i < doc.length; i++) {
    if (i >= startIndex && i < endIndex) {
      results.push(doc[i])
    }
  }
  return results
}

router.get('articles', function*(next) {
  var that = this
  var query = this.request.query
  var limit = query && query.limit,
    start = query && query.start;
  console.log(query)
  yield article.query({}).then(function (doc) {
    that.body = splitDoc(doc, start, limit)
  })
}).get('articles/:id', function*(next) {
  var hrefArr = this.request.href.split('/')
  var searchId = hrefArr[hrefArr.length - 1]
  var that = this
  yield article.queryById(searchId).then(function (doc) {
    that.body = doc
  })
}).post('articles/create', function*(next) {
  var that = this
  var opts = this.request.body
  yield article.save(opts).then(function (newData) {
    that.body = '创建文章成功！'
  })
}).post('articles/delete', function*(next) {
  var that = this
  var id = this.request.body.id
  yield article.remove(id).then(function (doc) {
    that.body = '删除文章成功！'
  })
});

module.exports = router;
