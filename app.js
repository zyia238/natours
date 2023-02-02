const express = require('express')

const toursRouter = require('./routes/tourRoutes')
const usersRouter = require('./routes/userRoutes')

const app = express()

app.use(express.static(`${__dirname}/public`))

app.use(express.json())

app.use('/api/v1/tours',toursRouter)
app.use('/api/v1/users',usersRouter)

app.all('*',(req,res,next)=>{
    const error = new Error('cant find page')
    error.statusCode = 400
    error.status = 'fail'
    next(error)
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const status = err.status || 'error'
    
    res.status(statusCode).json({
        status,
        msg:err.message
    })
})

module.exports = app