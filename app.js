const express = require("express")
const { json } = require("express/lib/response")
const dotenv = require('dotenv').config({path:"config.env"})
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const app = express()
const res = require("express/lib/response");
const uri = process.env.MongoDBURI
const DataBase = process.env.DBName

const port = process.env.Port_Number
app.listen(port,()=>{
    try {
        console.log("App listning on port number "+ port)
    } catch (error) {
        console.log("Error: " + error)
    }
    
})
app.use(express.json())
const ItemsRouter = require('./routes/items');
const { on } = require("nodemon");
app.use('/items',ItemsRouter)

module.exports.DBCon = async(func)=>{
    try{
        mongoose.connect(uri,{useNewUrlParser: true,dbName:DataBase})
        func()
        mongoose.disconnect
    }catch(error){
        console.error(error);
    }
}

