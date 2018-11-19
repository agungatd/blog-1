const route = require('express').Router()
const ArticleController = require('../controllers/articleController')
const isLogin = require('../middlewares/authentication')

route.get('/detail/:id',ArticleController.findOne)
route.get('/', ArticleController.findAllArticle)
route.get('/random', ArticleController.findOneRandom)
route.post('/', isLogin, ArticleController.createArticle)
route.put('/:id', isLogin, ArticleController.updateArticle)
route.put('/add-views/:id', ArticleController.updateViews)
route.delete('/:id', isLogin, ArticleController.deleteArticle)
route.post('/text-to-speech', ArticleController.getSpeech)
route.get('/popular', ArticleController.getPopular)

module.exports = route