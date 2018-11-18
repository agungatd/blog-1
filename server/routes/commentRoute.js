const route = require('express').Router()
const CommentController = require('../controllers/commentController')
const isLogin = require('../middlewares/authentication')

route.post('/:id', isLogin, CommentController.createComment)
route.delete('/:id', isLogin, CommentController.deleteComment)
route.get('/:id',CommentController.findComment)

module.exports = route