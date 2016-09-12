var router = require('koa-router')();
var Article = require('../controllers/article');

var article = new Article()

router.get('/', function *(next) {
  this.body = this;
}).get('topic', function *(next) {
  var that = this
  yield article.query({'tags': 'javascript'}).then(function (doc) {
    console.log(doc);
    that.body = doc;
  })
}).get('write', function *(next) {
  var that = this
  var data = {
    tags: 'javascript',
    title: '测试一下123',
    content: '<div>123123</div>'
  }
  yield article.save(data).then(function (newData) {
    that.body = newData
  })
});

module.exports = router;
