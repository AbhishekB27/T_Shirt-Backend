import { verifyJWT } from "../helper/jwt"

const isAuthenticated = (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1]
    console.log(token)
    if(token){
        const decodeToken = verifyJWT(token)
        console.log(decodeToken)
        const {role,_id}= decodeToken
        req.user = _id
    }
    else{
        return res.json({
            message:'UNAUTHORISED'
        })
    }
}

export default isAuthenticated