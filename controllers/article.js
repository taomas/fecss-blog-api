'use strict'

const Article = require('../models/article')
const article = new Article()

const splitDoc = function (doc, start, limit) {
  let startIndex = start * limit,
    endIndex = (start + 1) * limit;
  let results = []
  for (let i = 0; i < doc.length; i++) {
    if (i >= startIndex && i < endIndex) {
      results.push(doc[i])
    }
  }
  return results
}

const getAll = function*(next) {
  const ctx = this
  const query = ctx.request.query
  const limit = query && query.limit,
    start = query && query.start;
  const token = ctx.request.headers.token || '';
  yield article.query({}).then(function (doc) {
    var results = splitDoc(doc, start, limit)
    var maxIndex = Math.floor((doc.length - 1) / limit) // 向上取整
    ctx.body = {
      message: '获取文章成功',
      articles: results,
      maxIndex: maxIndex
    }
  })
}

const getArticle = function*(next) {
  const ctx = this
  const hrefs = this.request.href.split('/')
  const searchId = hrefs[hrefs.length - 1]
  yield article.queryById(searchId).then(function (doc) {
    if (doc) {
      ctx.body = {
        success: true,
        article: doc,
        message: '获取文章成功'
      }
    } else {
      ctx.body = {
        success: false,
        message: '获取文章失败'
      }
    }
  })
}

const getArchive = function*(next) {
  const ctx = this
  let result = []
  yield article.query({}).then(function (doc) {
    if (doc) {
      for (let i = 0; i < doc.length; i++) {
        let newEle = {
          _id: doc[i]._id,
          createTime: doc[i].createTime,
          title: doc[i].title
        }
        result.push(newEle)
      }
    }
    ctx.body = {
      message: '获取文章成功',
      articles: result
    }
  })
}

const getTagsList = function*(next) {
  const ctx = this
  const opts = this.request.body
  let result = []
  yield article.query({}).then(function (doc) {
    if (doc) {
      for (let i in doc) {
        const tags = doc[i].tags
        if (result.indexOf(tags) === -1) {
          result.push(tags)
        }
      }
      ctx.body = {
        success: true,
        message: '获取标签成功',
        tagsList: result
      }
    }
  })
}

const getTagsContent = function*(next) {
  const ctx = this
  const hrefs = this.request.href.split('/')
  const tags = decodeURIComponent(hrefs[hrefs.length - 1])
  yield article.query({tags: tags}).then(function (doc) {
    ctx.body = {
      success: true,
      message: '获取标签成功',
      tagsContent: {
        tags: tags,
        content: doc
      }
    }
  })
}

const getCreateTime = function () {
  const date = new Date()
  return date.getFullYear() + '-' + (date.getMonth() + 1 ) + '-' + date.getDate()
}

const createArticle = function*(next) {
  const ctx = this
  const opts = this.request.body
  opts.createTime = getCreateTime()
  yield article.save(opts).then(function (newData) {
    ctx.body = {
      message: '创建文章成功！',
      doc: newData,
      success: true
    }
  }).catch(function (error) {
    ctx.body = {
      message: '创建文章失败！',
      error: error,
      success: false
    }
  })
}

const editArticle = function*(next) {
  const ctx = this
  const opts = this.request.body
  const articleId = opts.articleId
  const articleDetail = opts.articleDetail
  yield article.queryById(articleId).then(function (doc) {
    Object.assign(doc, articleDetail) // 修改doc
    return doc.save()
  }).then(function (result) {
    if (result) {
      ctx.body = {
        success: true,
        message: '修改文章成功！',
        article: result
      }
    } else {
      ctx.body = {
        success: false,
        message: '修改文章失败！'
      }
    }
  })
}

const deleteAll = function*(next) {
  const ctx = this
  const id = this.request.body.id
  yield article.remove(id).then(function (doc) {
    ctx.body = {
      message: '删除文章成功！',
      success: true
    }
  })
}

module.exports = {
  getAll,
  getArticle,
  getArchive,
  createArticle,
  deleteAll,
  editArticle,
  getTagsList,
  getTagsContent
}
