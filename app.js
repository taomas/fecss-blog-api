var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , jwt = require('koa-jwt')
  , cors = require('kcors')
  , onerror = require('koa-onerror');

var articles = require('./routes/articles');
var users = require('./routes/users');
var admin = require('./routes/admin')

var db = require('./config/mongoose')();
db.on('error', console.error.bind(console, 'error: connect error!'))
db.once('open', function () {
  // 一次打开记录
  console.log('connect success!')
})

// global middlewares
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(cors());
app.use(jwt({secret: 'shared-secret', passthrough: true}));

// 后台用户认证
app.use(function *(next){
  var ctx = this
  // 如果不是admin，直接跳过该中间件
  if (ctx.request.url.indexOf('admin') === -1) {
    return yield next;
  }
  var token = ctx.request.headers.token || '';
  if (token) {
    var profile = jwt.verify(token, 'shared-secret');
    if (profile) {
      // 设置过期时间为7天
      if (Date.now() - profile.original_iat  < 7 * 24 * 60 * 60 * 1000) {
        ctx.user_token = profile;
        yield next;
      } else {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: 'token已过期'
        };
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'token认证失败'
      }
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'token认证失败'
    }
  }
});

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// routes definition
koa.use('/articles', articles.routes(), articles.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());
koa.use('/admin', admin.routes(), admin.allowedMethods());

// mount root routes
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
