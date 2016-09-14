var router = require('koa-router')();
var User = require('../controllers/user')

var user = new User()

router.post('/login', function *(next) {
  var opts = this.request.body;
  var ctx = this;
  yield user.query(opts).then(function (doc) {
    if (doc.length > 0) {
      ctx.body = {
        message: '登陆成功！',
        data: doc,
        status: 1
      }
    } else {
      ctx.body = {
        message: '用户名或密码错误',
        data: doc,
        status: 0
      }
    }
  })
}).post('/register', function *(next) {
  var opts = this.request.body;
  var ctx = this;
  yield user.query({username: opts.username}).then(function (doc) {
    if (doc.length >= 0) {
       ctx.body = {
         message: '该账户已存在',
         data: doc,
         status: 0
       }
    } else {
      user.query(opts).then(function (doc) {
        ctx.body = {
          message: '注册成功',
          data: doc,
          status: 1
        }
      })
    }
  })
  // yield user.query(opts).then(function (doc) {
  //
  // })
  // yield user.save(opts).then(function (doc) {
  //   ctx.body = {
  //     message: '注册成功',
  //     data: doc
  //   }
  // })

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
