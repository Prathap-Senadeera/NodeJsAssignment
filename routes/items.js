const express = require("express");
//const { MongoDBNamespace } = require("mongodb");
const { default: mongoose, deleteModel } = require("mongoose");
const router = express.Router();
const items =  require('../schema');
const MongoDBcon = require('../app');
const {body,validationResult, check}=require('express-validator')

const itemidMinLength = 4       
const itemidMaxLength =4
const itemNameMaxLength = 20
const itemDescriptionLength = 100



router.get('/',async(req,res)=>{
    try {
        async function getfunction(){
            const itemList = await items.find()
            res.json(itemList)
        }
        MongoDBcon.DBCon(getfunction)
    } catch (error) {
        res.status(500).send('Error: '+ error)
    }
})

router.get('/:id',[
    check('id').trim().isLength({min:itemidMinLength,max:itemidMaxLength}).withMessage('Id should be 4 charactors')
],async(req,res)=>{
    try {
        async function findItems(){
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send(errors)
            }
            const itemList = await items.findOne({Id:req.params.id})
            if (itemList===null) {
                res.status(404).send(`There is no item to Id : ${req.params.id}`)
            }else{
                res.status(200).json(itemList)
            }
        }
        MongoDBcon.DBCon(findItems)
    } catch (error) {
        res.status(500).send('Error: '+ error)
    }
})

router.post('/',[
    body('Id').trim().not().isEmpty().withMessage('Id required').isLength({min:itemidMinLength,max:itemidMaxLength}).withMessage('id length should be 4'),
    body('Name').trim().not().isEmpty().withMessage('Name required').isLength({max:itemNameMaxLength}).withMessage('Name length should be less than 20'),
    body('Description').not().trim().isEmpty().withMessage('Description required').isLength({max:itemDescriptionLength}).withMessage('Description length should be less than 100'),
    body('Price').trim().not().isEmpty().withMessage('Description required').isNumeric().withMessage('Price should be a number'),
    body('Quantity').trim().not().isEmpty().withMessage('Description required').isNumeric().withMessage('Quantity should be a number')
],async(req,res)=>{
    const Newitems = new items({
        Id: req.body.Id,
        Name:req.body.Name,
        Description: req.body.Description,
        Price:req.body.Price,
        Quantity:req.body.Quantity
    })
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors})
        }else{
            async function postfunction(){
                const post = await Newitems.save()
                res.status(201).json(post)
            }
        MongoDBcon.DBCon(postfunction)
        }
        
    } catch (error) {
        res.status(500).send('Error: '+ error)
    }
})

router.put('/:id',[
    body('Name').trim().isLength({max:itemNameMaxLength}).withMessage('Name length should be less than 20').optional(),
    body('Description').isLength({max:itemDescriptionLength}).withMessage('Description length should be less than 100').optional(),
    body('Price').trim().isNumeric().withMessage('Price should be a number').optional(),
    body('Quantity').trim().isNumeric().withMessage('Quantity should be a number').optional()
],async(req,res)=>{
    try {
        async function UpdateItem(){
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(req.body)
                return res.status(400).send(errors)
                
            }
            try {
                const itemList = await items.findOneAndUpdate({Id:req.params.id},req.body)
                return res.status(200).send("successfully updated")
            } catch (error) {
                return res.status(404).send("id not found")
            }
        }
        MongoDBcon.DBCon(UpdateItem)
    } catch (error) {
        res.send('Error: '+error)
    }
})

router.delete('/:id',[
    check('id').trim().isLength({min:itemidMinLength,max:itemidMaxLength}).withMessage('Id should be 4 charactors')
],async(req,res)=>{
    try {
        async function DeleteItems(){
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send(errors)
            }else{
                const itemlist =await items.deleteOne({Id:req.params.id})
                if (itemlist.deletedCount < 1) {
                    return res.status(404).send("Item Id is not in the system.")                
                }else{
                    res.status(204).json(itemlist)
                }
            } 
        }
        MongoDBcon.DBCon(DeleteItems)
    } catch (error) {
        res.send('Error: '+error)
    }
    
})

module.exports = router

