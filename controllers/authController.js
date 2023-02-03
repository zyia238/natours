const { promisify } = require('util')
const User = require('../models/userModel');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('../utils/email')

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
  // enable follwing middleware to consume userData
  req.user = user
  next()
});

exports.restrictTo = (...roles) => {
  return (req,res,next) => {
    if(roles.includes(req.user.role)){
      next()
    }else{
      next(new Error('no permission'))
    }
  }
}

exports.forgetPassword = catchAsync(async (req,res,next) => {
    const {email} = req.body
    if(!email){
      next(new Error('please provide email'))
    }
    const user = await User.findOne({email})

    if(!user){
      next(new Error('Invalid email'))
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hased = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.passwordResetToken = hased
    user.passwordResetTokenExpiresIn = new Date().getTime() + 10 * 60 * 1000
    
    await user.save({validateBeforeSave:false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    await sendMail({
      from: "sender@server.com",
      email:user.email,
      subject: 'passwordResetToken',
      text:resetUrl,
    })

    res.json({
      status:"success",
      msg:"password token sent"
    })
  }
)

exports.resetPassword = async (req,res,next)=>{
  // we pass the resetToken through the params
  const resetToken = req.params.token
  const recreatedHashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  // find the target user and verify the token
  const user = await User.findOne({
    passwordResetToken:recreatedHashedToken
  })

  if(!user){
    return next(new Error('the user doesnt exist'))
  }
  if(!req.body.password || !req.body.passwordConfirm){
    return next(new Error('enter the password'))
  }
  user.password = await bcrypt.hash(req.body.password, 12)
  user.passwordConfirm = undefined

  const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{
    expiresIn:'90d'
  })

  res.status(200).json({
    status:"success",
    token
  })
}