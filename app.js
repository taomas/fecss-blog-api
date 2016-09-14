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
app.use(jwt({ secret: 'shared-secret', passthrough: true }).unless({ path: [/^\/login/] }));

// app.use(function *(){
//   if (this.url.match(/^\/admin/)) {
//     this.body = {
//       message: '用户未登陆',
//       ok: false
//     };
//   }
// });

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
