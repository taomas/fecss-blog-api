const router = require('koa-router')()
const article = require('../controllers/article')

router.get('/', article.getAll)
  .get('/:id', article.getArticle)

module.exports = router;
