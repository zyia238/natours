const { promisify } = require('util')
const User = require('../models/userModel');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async(req, res, next) => {
  const reqBody = {...req.body}
  reqBody.password = await bcrypt.hash(reqBody.password, 12)
  reqBody.passwordConfirm = undefined
  const user = await User.create(reqBody);

  const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{
    expiresIn:'90d'
  })
  
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async(req, res, next) => {
  const {email , password } = req.body

  if(!email || !password){
    return next(new Error('missing email or password'))
  }

  const targetUser = await User.findOne({email})

  if(!targetUser){
    return next(new Error('invalid email or password'))
  }

  const isValid = await bcrypt.compare(password , targetUser.password)

  if(isValid){
    const token = JWT.sign({id:targetUser._id},process.env.JWT_SECRET,{
      expiresIn:'90d'
    })
  
    res.status(200).json({
      status: 'success',
      token,
    });
  }else{
    return next(new Error('invalid email or password'))
  }
});

exports.protect = catchAsync(async(req, res, next) => {
  // check if token provided
  if(!req.headers.authorization){
    return next(new Error('you have to login'))
  }
  const token = req.headers.authorization.split(' ')[1]
  // verification token
  const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET)
  // check the user still exists in database
  const user = await User.findById(decoded.id)
  if(!user){
    return next(new Error('user no longer exists'))
  }
  // check if the user changed the password after token issued
  if(user.passwordChangedAt){
    const changedTime = parseInt(user.passwordChangedAt.getTime()/1000)
    console.log(changedTime, decoded.iat)
    if(changedTime > decoded.iat){
      return next(new Error('password changed after the token issued'))
    }
  } 
  next()
});

