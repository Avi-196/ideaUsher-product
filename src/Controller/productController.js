const productModel=require("../Model/productModel")



const isValid=function(value){
    if(typeof value==="undefined"||typeof value===null) return false
    if(typeof value==="string"&& value.trim().length===0) return false
    return true
}

const createProduct=async function(req,res){
    try {
        let data=req.body
        
 let {name,description,price} =data
       if(!isValid(name)){
          return res.status(400).send({status:false,msg:"name is required"})
       }
       if(!isValid(description)){
           return res.status(400).send({status:false,msg:"please fill the description about product"})
       }
       if(!isValid(price)){
          return res.status(400).send({status:false,msg:"fill the product price"})
       }
    
       let aboutProduct={
           name:name,
           description:description,
           price:price,
           image:req.file.filename
       }
       const product=await productModel.create(aboutProduct)
       return res.status(201).send({status:true,msg:" congrats!product created sucessfull",data:product})
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}



const getProductWitPaginate=async function(req,res){
    try {
         var page=req.body.page
         var sort=req.body.sort
         if(page<=1){
            skip=0
         }else{
            skip=(page-1)*2
         }
         if(sort=="name"){
            var product= await productModel.find().sort({name:1}).skip(skip).limit(2)
         }else{
          var product= await productModel.find().skip(skip).limit(2)
         }
         res.status(200).send({status:true,msg:"product details",data:product})
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

const updateProduct=async function(req,res){
     try {
        let data=req.body
        let productID=req.params.productID
       
        var obj
        if(req.file!==undefined){
              obj={
                name:data.name,
                description:data.description,
             price:data.price,
              image:req.file.filename
              }
        }else{
            obj={
                name:data.name,
                description:data.description,
             price:data.price,
            }
        }
       
        let productUpdate=await productModel.findByIdAndUpdate({_id:productID},{$set:obj},{new:true})
        return res.status(200).send({msg:" product!updated sucessfull",data:productUpdate})
     } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
     }
}


const deleteProduct=async function(req,res){
    try {
        
        let productID=req.params.productID
        const product=await productModel.findById({_id:productID})
        if(!product){
            return res.status(404).send({status:false,msg:"product data not found"})
        }
        if(product.isDeleted===true){
            return res.status(400).send({status:false,msg:"already deleted"})
        } 
       
        const productDetails=await productModel.findByIdAndUpdate({_id:productID},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})
        return res.status(200).send({status:true,msg:"deleted",data:productDetails})  
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}





module.exports.createProduct=createProduct

module.exports.getProductWitPaginate=getProductWitPaginate

module.exports.updateProduct=updateProduct

module.exports.deleteProduct=deleteProduct