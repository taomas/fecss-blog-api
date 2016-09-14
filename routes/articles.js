var router = require('koa-router')()
var Article = require('../controllers/article')

var article = new Article()

function splitDoc (doc, start, limit) {
  var startIndex = start * limit,
    endIndex = (start + 1) * limit;
  var results = []
  for (var i = 0; i < doc.length; i++) {
    if (i >= startIndex && i < endIndex) {
      results.push(doc[i])
    }
  }
  return results
}

router.get('/', function*(next) {
  var that = this
  var query = this.request.query
  var limit = query && query.limit,
    start = query && query.start;
  var headers = this.request.headers;
  console.log(headers.token);
  yield article.query({}).then(function (doc) {
    var results = splitDoc(doc, start, limit)
    var maxIndex = Math.floor(doc.length / limit) // 向上取整
    that.body = {
      message: '获取文章成功',
      articles: results,
      maxIndex: maxIndex
    }
  })
}).get('/:id', function*(next) {
  var hrefArr = this.request.href.split('/')
  var searchId = hrefArr[hrefArr.length - 1]
  var that = this
  yield article.queryById(searchId).then(function (doc) {
    that.body = doc
  })
}).post('/create', function*(next) {
  var that = this
  var opts = this.request.body
  yield article.save(opts).then(function (newData) {
    that.body = {
      message: '创建文章成功！',
      doc: newData,
      ok: true
    }
  }).catch(function (error) {
    that.body = {
      message: '创建文章失败！',
      error: error,
      ok: false
    }
  })
}).post('/delete', function*(next) {
  var that = this
  var id = this.request.body.id
  yield article.remove(id).then(function (doc) {
    that.body = {
      message: '删除文章成功！',
      ok: true
    }
  })
});

module.exports = router;
