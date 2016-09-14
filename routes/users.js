var router = require('koa-router')();
var jwt = require('koa-jwt')

var User = require('../controllers/user')
var user = new User()

router.post('/login', function *(next) {
  var opts = this.request.body;
  var ctx = this;
  var token = jwt.sign(opts.username, 'shared-secret', {expiresIn: 90 * 24 * 60 * 60});
  yield user.query(opts).then(function (doc) {
    if (doc.length > 0) {
      ctx.body = {
        message: '登陆成功！',
        data: doc,
        ok: true,
        token: token
      }
    } else {
      ctx.body = {
        message: '用户名或密码错误',
        data: doc,
        ok: false
      }
    }
  })
}).post('/register', function *(next) {
  var opts = this.request.body;
  var ctx = this;
  yield user.query({username: opts.username}).then(function (doc) {
    if (doc.length > 0) {
       ctx.body = {
         message: '该账户已存在',
         data: doc,
         ok: false
       }
    } else {
      user.query(opts).then(function (doc) {
        ctx.body = {
          message: '注册成功',
          data: doc,
          ok: true
        }
      })
    }
  })
}).get('/query', function *(next) {
  var ctx = this;
  yield user.queryAll().then(function (doc) {
    ctx.body = doc
  })
}).get('/delete', function *(next){
  var ctx = this;
  yield user.removeAll().then(function (err, doc) {
    ctx.body = {
      message: '删除所有账户成功',
      data: doc
    }
  })
});

module.exports = router;
