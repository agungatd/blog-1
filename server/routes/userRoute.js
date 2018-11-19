const route = require('express').Router()
const UserController = require('../controllers/userController')
const isLogin = require('../middlewares/authentication')

route.get('/', UserController.getAllUsers)
route.post('/register', UserController.register)
route.post('/login', UserController.login)
route.put('/add-follower/:id', UserController.updateFollower)
route.get('/followers/:id', UserController.getAllFollowers)
// route.get('/data', isLogin, UserController.getUserData)

module.exports = route