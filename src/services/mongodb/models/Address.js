import mongoose from 'mongoose';
const AddressSchema = new mongoose.Schema({
    tag:{
        type:String,
        enum:['Home', 'Work', 'Other']
    },
    pincode:{
        type:Number,
        required:true,
        maxlength:6
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:false
    },
    fullAddress:{
        type:String,
        required:true
    },
    addresses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Address'
        }
    ]
})

AddressSchema.statics = {
    isValid(id){
        return this.findById(id).then(result=> {
            if(!result) throw new Error('Address Not Found')
        })
    }
}
export const Address = mongoose.model('Address',AddressSchema)