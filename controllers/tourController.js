const Tour = require('./../models/tourModel') 

exports.aliasMiddleware = (req,res,next)=>{
  req.query.limit = 5
  req.query.sort = "price"
  next()
}

exports.getAllTours = async (req, res) => {
  try{
    const queryObj = {...req.query}
    const excludedFields = ['page','sort','limit','fields']
    excludedFields.forEach(field => delete queryObj[field])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    if(req.query.sort){
      let sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    }

    if(req.query.fields){
      let selectBy = req.query.fields.split(',').join(' ')
      query = query.select(selectBy)
    }

    let page = req.query.page || 1
    let limit = req.query.limit || 3
    let skip = ( page - 1 ) * limit
    query = query.skip(skip).limit(limit)
    
    const tours = await query

    res.json({
      status:"success",
      data:{
        tours
      }
    })
  }catch(err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
};

exports.getOneTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id)
    // const tour = await Tour.find({_id:req.params.id})
    // const tour = await Tour.find({ price : { $lt : 500}})
    res.json({
      status:"success",
      data:{
        tour
      }
    })
  }catch(err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
};

exports.createNewTour = async (req, res) => {
  try{
    const data = await Tour.create(req.body)
    res.json({
      status:"success",
      data:{
        tour:data
      }
    })
  } catch (err){
    res.status(400).json({
      status:"fail",
      message:err
    })
  }
};

exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
    })
    res.json({
      status:"success",
      data:{
        tour
      }
    })
  } catch (err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
};

exports.deleteTour = async (req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status:"success",
      data:null
    })
  } catch (err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
};

exports.getToursStats = async (req,res) => {
  try{
    const queryResult = await Tour.aggregate([
      {
        $group : {
          _id: '$difficulty',
          avgRatings: { $avg : '$ratingsAverage'}
        }
      }
    ])

    res.status(200).json({
      status:"success",
      data:queryResult
    })

  }catch(err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
}

exports.getBusiestMonth = async (req,res) => {
  try{
    const queryResult = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates : {
            $gte: new Date('2021-01-01'),
            $lte: new Date('2021-12-31'),
          }
        }
      },
      {
        $group: {
          _id:{ $month : '$startDates'},
          tours:{
            $push: `$name`
          },
          toursNum: {
            $sum : 1
          }
        }
      },
      {
        $sort : { toursNum : -1}
      },
    ])

    res.status(200).json({
      status:"success",
      data:queryResult
    })

  }catch(err){
    res.status(400).json({
      status:"fail",
      message:"Invalid"
    })
  }
}
