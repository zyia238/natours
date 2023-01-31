const fs = require('fs')
const { join } = require('path')
const users = JSON.parse(fs.readFileSync(join(__dirname,'..', 'dev-data','data','users.json'),'utf-8'))

exports.getAllUsers = (req,res)=>{
    res.json({
        status:200,
        data:{
            users
        }
    })
}