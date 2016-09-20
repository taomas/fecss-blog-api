const router = require('koa-router')()
const article = require('../controllers/article')

router.get('/', article.getAll)
  .post('/create', article.createArticle)
  .post('/delete', article.deleteAll)
  .post('/edit', article.editArticle)

module.exports = router;
