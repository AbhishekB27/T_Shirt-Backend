import express from 'express';
import { body, validationResult} from 'express-validator';
import { Category, Product } from '../services/mongodb/index';
const router = express.Router();

/*
type: Get
path: /api/v1/product/all
params: none
isProtected: false (public)
*/
router.get('/all',async (req,res)=>{
    try {
        const products = await Product().find({}).populate('category');
        return res.json({
            products: products,
            message: 'Successfully fetched all products'
        })
    } catch (error) {
        console.log(error);
        return res.json({
            products: [],
            message: 'Failed to fetch all products'
        })
    }
})

/*
type: Get
path: /api/v1/product/all
query: categoryId
isProtected: false (public)
*/
router.get('/all',async(req,res)=>{
    try {
        const {categoryId} = req.query
    const products = await Product.find({category: categoryId}).populate('category')
    return res.status(200).json({
        products: products,
        message: 'Successfully fetched all products'
    })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            products: [],
            message: 'Error fetching all products'
        })
    }
})

/*
type: Post
path: /api/v1/product/all
query: categoryId
isProtected: true (admin)
*/
router.post('/add',
body('name').isLength({min:1}),
body('price').isNumeric(),
body('discount').isNumeric(),
body('stock').isNumeric(),
body('description').isLength({min:10}),
body('size').isNumeric({min:2}),
body('category').isLength({min:15}),
body('imageUrl').isURL(),
async (req,res)=>{
    const { errors } = validationResult(req);    
    if(errors.length > 0) {
        return res.json({
            errors: errors,
            message: 'Bad request, Validation failed', 
        })
    }  
    const data = req.body  
    // res.send(data)
    try {
        //check if category is already present/valid
        const category = await Category.findById(data.category);
        if(!category) return res.json({
            products: null,
            message: 'Invalid category'
        })
        const product = new Product(req.body)
        await product.save()
        res.json({
            product: product,
            message: 'Product saved successfully in DB'
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            product:null,
            message: 'Unable to save product'
        })
    }
})

/*
type: Post
path: /api/v1/product/:id
query: categoryId
isProtected: true (admin)
*/
router.put('/update/:id',async()=>{
    const {id} = req.params
    try {
        if(req.body.category){
            const category = await Category.findById(req.body.category)
            if(!category) return res.json({
                product :null,
                message:'Invalid category'
            })
        }
        const product = await Product.findOneAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json({
            product:product,
            message:'Product updated successfully in DB'
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            product:null,
            message:'Unable to update product in DB'
        })
    }
})

/*
type: delete
path: /api/v1/product/:id
query: categoryId
isProtected: true (admin)
*/
router.delete('/delete/:id',async (req,res)=>{
    const {id} = req.params
    try {
        const category = await Product.findByIdAndRemove(id)
        res.status(200).json({
            category:category,
            message:'category deleted successfully in DB'
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            category:null,
            message:'Unable to delete category'
        })
    }
})
export default router