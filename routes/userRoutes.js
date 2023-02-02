const express = require('express')
const {getAllUsers} = require('../controllers/userController')
const {signUp , login , protect} = require('../controllers/authController')

const usersRouter = express.Router()

usersRouter.route('/').get(protect,getAllUsers)
usersRouter.route('/signup').post(signUp)
usersRouter.route('/login').post(login)

module.exports = usersRouter