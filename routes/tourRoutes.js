const express = require('express')

const {getAllTours, createNewTour , getOneTour , updateTour} = require('../controllers/tourController')

const toursRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createNewTour)
toursRouter.route('/:id').get(getOneTour).patch(updateTour)

module.exports = toursRouter