var router = require('koa-router')()
var Article = require('../controllers/article')

var article = new Article()

router.get('articles', function*(next) {
  var that = this
  yield article.query({}).then(function(doc) {
    that.body = doc
  })
}).get('articles/:id', function*(next) {
  var hrefArr = this.request.href.split('/')
  var searchId = hrefArr[hrefArr.length - 1]
  var that = this
  yield article.queryById(searchId).then(function(doc) {
    that.body = doc
  })
}).post('write', function*(next) {
  var that = this
  var data = {
    tags: 'javascript',
    title: '测试一下123',
    content: '<div>123123</div>'
  }
  yield article.save(data).then(function(newData) {
    that.body = newData
  })
}).post('remove', function*(next) {

});

module.exports = router;
