import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    stock:{
        type:Number,
        required:true
    },
    size:{
        type:Number,
        required:true,
        enum:[34,36,38,40,42]
    },
    imageUrl:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

ProductSchema.pre('save', function(next){
    const {price,discount} = this
    let actualPriceAfterDiscount = price * (1-(discount/100))
    this.price = parseInt(actualPriceAfterDiscount)
    next()
})

ProductSchema.statics = {
    isValid(id){
        return this.findById(id).then(result=> {
            if(!result) throw new Error('Product Not Found')
        })
    }
}

export const Product = mongoose.model('Prodcut',ProductSchema);