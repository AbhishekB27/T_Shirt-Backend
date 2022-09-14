import  express from "express";
const router = express.Router();
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import {body,validationResult} from "express-validator"
import User from '../services/mongodb/models/User'
import {comparePassword} from '../helper/util'
import {createJWT} from '../helper/jwt'
import isAdmin from "../middlewares/isAdmin";


/*
type: Get
path: /api/v1/auth/user
params: none
isProtected: true
*/

router.get('/users',isAdmin,async(req,res)=>{
    try {
        const users = await User.find({})
        res.json({users})
    } catch (error) {
        console.log(error.message)
    }
})

/*
type: Post
path: /api/v1/auth/signUp
params: none
isProtected: false
*/

router.post('/signup',
body('firstName').isLength({min:5}),
body('email').isEmail(),
body('password').isLength({min:2}),
async  (req,res)=>{
    const {errors} = validationResult(req)

    if(errors.length > 0) return res.status(403).json({errors,message: 'Bad request'})

    try {

        const {firstName,lastname='', email, password} = req.body
        const user = new User(firstName,lastname,email,password)
        await user.save()
        res.json(user)

    } catch (error) {
        console.log(error.message)
        res.json({users: {} })
    }
})

/*
type: Post
path: /api/v1/auth/login
params: none
isProtected: false
*/

router.post('/login', async(req,res)=>{
    try {
        const {email, password}= req.body
        //find the user
        const user = await User.findOne({email})
        
        if(user){
            const isVerified = comparePassword(password, user.password)
            if(isVerified){
                const {_id,role} = user
                const token = createJWT({_id,role},'1h')
                return res.json({token:token})
            }
            else{
                return res.json({token:null,message:"Unauthorized"})
            }
        }
        else{
            return res.json({
                token:null,message:"User does not exist"
            })
        }
    } catch (error) {
        res.json({token:null,message:error.message})
        console.log(error.message)
    }
})

export default router