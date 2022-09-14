import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import orderRoutes from './routes/orderRoutes'
import productRoutes from './routes/productRoutes'
import { connectDb } from './services/mongodb/connectDB'


const app = express()
app.use(express.json()) // body parser middleware
const PORT = process.env.PORT || 8080
dotenv.config('../.env')//it loads the .env file into the process (environment variables)
connectDb()
app.use(cors());

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);
app.use("/product", productRoutes);

// app.get('/',(req,res)=>{
//     res.send('Hello Abhishek!')
// })
// app.get('/auth',(req,res)=>{
//     res.send('Hello I Am Backend!')
// })

app.listen(PORT,()=>{
    console.log('Server is running on port '+ PORT)

})

