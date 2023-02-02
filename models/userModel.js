const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true,'must have username']
    },
    email:{
      type:String,
      required:[true,'must have email address'],
      unique:[true,'email must be unique'],
    },
    password:{
      type:String,
      // minLength:8
    },
    photo:String,
    passwordConfirm:{
      type:String,
      validate:{
        validator(val){
          return val === this.password
        },
        message:"different confirmed password"
      }
    },
    passwordChangedAt:{
      type:Date,
      default:new Date().getTime()
    }
  })

const User = mongoose.model('User',userSchema)

module.exports = User