var router = require('koa-router')();
var Article = require('../controllers/article');

var article = new Article()

router.get('/', function *(next) {
  this.body = this;
}).get('topic', function *(next) {
  article.query({'tags': 'javascript'}, function (doc) {
    console.log(doc)
  })
  this.body = 'this is topic'
}).get('write', function *(next) {
  var data = {
    tags: 'javascript',
    title: '测试一下',
    content: '<div>123123</div>'
  }
  article.save(data, function (newData) {
    console.log(newData)
  })
});

module.exports = router;
