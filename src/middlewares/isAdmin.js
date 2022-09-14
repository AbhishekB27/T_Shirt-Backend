import {verifyJWT} from "../helper/jwt"
const isAdmin = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token)

    if(token){
        const verifyToken = verifyJWT(token)
        console.log(verifyToken)
        const {role} = verifyToken

        if(role)next()
        else return res.json({
            message:'ACCESS DENIED'
        })
    }
    else{
        return res.json({
            message:'UNAUTHORISED'
        })
    }
}
export default isAdmin