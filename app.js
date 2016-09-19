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

app.use(function *(next){
  var ctx = this
  console.log(ctx.url);
  if (this.url.indexOf('login') !== -1) {
    return yield next;
  }
  var profile = jwt.verify(ctx.request.headers.token || ctx.request.body.token, 'shared-secret');
  console.log(ctx.request.headers.token, profile);
  console.log(Date.now() - profile.original_iat);
  if (profile) {
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
    ctx.body = {
      success: false,
      message: 'token信息错误'
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

// mount root routes
app.use(koa.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

module.exports = app;
