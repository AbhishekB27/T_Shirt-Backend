import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    addresses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Address'
        }
    ]
})

UserSchema.statics = {
    isValid(id){
        return this.findById(id).then(result=> {
            if(!result) throw new Error('User Not Found')
        })
    }
}

export const User = mongoose.model('User',UserSchema)