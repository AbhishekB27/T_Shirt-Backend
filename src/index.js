import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()
app.use(express.json()) // body parser middleware
const PORT = process.env.PORT || 8080
dotenv.config('../.env')//it loads the .env file into the process (environment variables)

app.get('/',(req,res)=>{
    res.send('Hello Abhishek!')
})
app.get('/auth',(req,res)=>{
    res.send('Hello I Am Backend!')
})

app.listen(PORT,()=>{
    console.log('Server is running on port '+ PORT)
})

