const express = require('express')

const {getAllTours, createNewTour , getOneTour , updateTour , aliasMiddleware , getToursStats , getBusiestMonth} = require('../controllers/tourController')
const { protect } = require('../controllers/authController')
const toursRouter = express.Router();

toursRouter.route('/').get(getAllTours).post(createNewTour)
toursRouter.route('/tourStats').get(getToursStats)
toursRouter.route('/busiestMonth').get(getBusiestMonth)
toursRouter.route('/top-5-cheap').get(aliasMiddleware,getAllTours)
toursRouter.route('/:id').get(getOneTour).patch(updateTour)

module.exports = toursRouter