import mongoose from 'mongoose';

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