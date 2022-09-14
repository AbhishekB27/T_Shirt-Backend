import mongoose from 'mongoose';
import { Product } from './Product'

const OrderSchema = new mongoose.Schema({
   products:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Prodcut'
        },
        quantity:{
            type:Number,
            default:1
        }
    }
   ],
    total:{
        type:Number,
        required:true
    },
    subTotal:{
        type:Number,
        required:true
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum:['created','paid','shipped','delivered','canceled']
    }
})

OrderSchema.pre('save', async function (next){
    try {
        console.log(this)
        const {products} = this
        let total=0
        let subTotal = 0
        for(let i=0; i < products.length; i++){
            const {product:productId,quantity}= products[i]
            const product = await Product.findById(productId)
            //check the stock
            if(product.stock < quantity){
                return next(new Error('Not enough stock'))
            }
            await Product.findByIdAndUpdate(productId,{
                $inc:{stock: -quantity}
            })
            total += product.price = quantity
            subTotal += product.discount * quantity
        }
        this.total = total
        this.subTotal = subTotal
        next()//me yha pe tha kal
    } catch (error) {
        next(error)
    }
})
OrderSchema.statics = {
    isValid(id){
        return this.findById(id).then(result=> {
            if(!result) throw new Error('Order Not Found')
        })
    }
}
export const Order = mongoose.model('Order',OrderSchema);