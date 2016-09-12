var router = require('koa-router')();

router.get('/login', function *(next) {
  this.body = 'this a users response!';
});

module.exports = router;
