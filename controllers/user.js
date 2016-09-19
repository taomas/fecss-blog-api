'use strict'
const jwt = require('koa-jwt')
const User = require('../models/user')
const user = new User()

const login = function *(next) {
  const ctx = this;
  const opts = ctx.request.body;
  const token = jwt.sign(JSON.stringify({ name: opts.name, original_iat: Date.now()}), 'shared-secret');
  yield user.query(opts).then(function (doc) {
    const user = doc[0] || ''
    if (user) {
      ctx.body = {
        message: '登陆成功！',
        user: user,
        ok: true,
        token: token
      }
    } else {
      ctx.body = {
        message: '用户名或密码错误',
        user: user,
        ok: false
      }
    }
  })
}

const register = function *(next) {
  const ctx = this;
  const opts = this.request.body;
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
}

const userAuth = function *(next) {
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
}

const query = function *(next) {
  const ctx = this;
  yield user.queryAll().then(function (doc) {
    ctx.body = doc
  })
}

const deleteAll = function *(next){
  const ctx = this;
  yield user.removeAll().then(function (err, doc) {
    ctx.body = {
      message: '删除所有账户成功',
      data: doc
    }
  })
}

module.exports = {
  login,
  register,
  query,
  deleteAll
}
