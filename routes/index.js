var router = require('koa-router')()
var Article = require('../controllers/article')

var article = new Article()

router.get('articles', function*(next) {
  var that = this
  yield article.query({}).then(function (doc) {
    that.body = doc
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
