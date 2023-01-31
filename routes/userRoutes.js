const express = require('express')
const {getAllUsers} = require('../controllers/userController')

const usersRouter = express.Router()

usersRouter.route('/').get(getAllUsers)

module.exports = usersRouter