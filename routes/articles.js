const router = require('koa-router')()
const article = require('../controllers/article')

router.get('/', article.getAll)
  .get('/:id', article.getArticle)
  .post('/create', article.createArticle)
  .post('/delete', article.deleteAll)

module.exports = router;
