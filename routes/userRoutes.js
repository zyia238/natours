const express = require('express')
const {getAllUsers} = require('../controllers/userController')
const {signUp , login , protect , forgetPassword , resetPassword , updatePassword} = require('../controllers/authController')

const usersRouter = express.Router()

usersRouter.route('/').get(protect,getAllUsers)
usersRouter.route('/signup').post(signUp)
usersRouter.route('/login').post(login)
usersRouter.route('/forgetPassword').post(forgetPassword)
usersRouter.route('/resetPassword/:token').patch(resetPassword)
usersRouter.route('/updatePassword').patch(protect, updatePassword)

module.exports = usersRouter