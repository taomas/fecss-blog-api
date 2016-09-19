const router = require('koa-router')();
const user = require('../controllers/user')

router.post('/login', user.login)
  .post('/register', user.register)
  .get('/query', user.query)
  .get('/delete', user.deleteAll);

module.exports = router;
