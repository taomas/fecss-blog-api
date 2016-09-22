const router = require('koa-router')()
const article = require('../controllers/article')

router.get('/', article.getAll)
  .get('/:id', article.getArticle)
  .get('/archive', article.getArchive)
  .get('/tags', article.getTagsList)
  .get('/tags/:id', article.getTagsContent)

module.exports = router;
