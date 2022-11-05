const express=require("express")
const product_route=express()
const router=express.Router()

const multer=require("multer")
const path=require('path')

product_route.use(express.static("public"))
   const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/productImage"),function(error,sucess){
            if(error) throw error
        })
    },
    filename:function(req,file,cb){
       const name= Date.now()+"_"+file.originalname
       cb(null,name,function(error1,sucess1){
        if(error1) throw error1
       })
    }

})
const upload=multer({storage:storage})



const productController=require("../Controller/productController")

router.post("/product",upload.single('image'),productController.createProduct)

router.post("/paginate",productController.getProductWitPaginate)

router.put("/productUpdate/:productID",upload.single('image'),productController.updateProduct)

router.delete("/productDelete/:productID",productController.deleteProduct)


module.exports=router