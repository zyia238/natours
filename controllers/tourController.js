const Tour = require('./../models/tourModel') 

exports.getAllTours = async (req, res) => {
  try{
    const tours = await Tour.find()
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
      message:"Invalid"
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
