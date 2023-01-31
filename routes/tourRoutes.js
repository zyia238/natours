const express = require('express')

const {getAllTours, createNewTour} = require('../controllers/tourController')

const toursRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createNewTour)

module.exports = toursRouter