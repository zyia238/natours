const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const Tour = require('./../../models/tourModel')
dotenv.config({path:'../../config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true
})

const dataList = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

const insertData = async () => {
    try{
        await Tour.insertMany(dataList)
        console.log('inserted')
    }catch (err){
        console.log(err)
    }
    process.exit()
}


const deleteData = async () => {
    try{
        await Tour.deleteMany()

        console.log('deleted')
    }catch (err){
        console.log(err)
    }
    process.exit()
}

if(process.argv[2] === '--import'){
    insertData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}