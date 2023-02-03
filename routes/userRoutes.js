const express = require('express')
const {getAllUsers} = require('../controllers/userController')
const {signUp , login , protect , forgetPassword , resetPassword} = require('../controllers/authController')

const usersRouter = express.Router()

usersRouter.route('/').get(protect,getAllUsers)
usersRouter.route('/signup').post(signUp)
usersRouter.route('/login').post(login)
usersRouter.route('/forgetPassword').post(forgetPassword)
usersRouter.route('/resetPassword/:token').patch(resetPassword)

module.exports = usersRouter