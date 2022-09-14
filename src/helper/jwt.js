import jwt from 'jsonwebtoken'
const secret = process.env.SECRET || 'abhishekb27'

const createJWT = (payload,expiry='1d') => jwt.sign(payload,secret,{expiresIn:expiry})

const verifyJWT = (token)=>{
    try {
        const data = jwt.verify(token,secret)
        if(data) return true
        else return false
    } catch (error) {
        console.log(error.message)
    }
}

const decodeJWT = (token)=> jwt.decode(token)

export {createJWT, verifyJWT,decodeJWT}
