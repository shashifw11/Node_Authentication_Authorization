const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : {type:String , required : true},
    price : {type : String , required : true},
    image_urls : [{type:String , required : true}],
},{
    versionKey : false,
    timestamps : true
})
 
const Product = mongoose.model("product" ,productSchema ) 

module.exports =  Product



