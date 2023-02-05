const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config({path:"config.env"})
const collection = process.env.collection
const ItemsSchema = new mongoose.Schema({
    Id:{
        type:String,
        required: true
    },
    Name:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Price:{
        type:Decimal128,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("TestCollection",ItemsSchema,collection)