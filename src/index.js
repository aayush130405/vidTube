import { app } from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({       //configutring the dotenv package
    path: './.env'
})

const PORT = process.env.PORT || 8000   //use port from .env or use 8000

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`I am listening!!! @${PORT}`);
})
})
.catch((err)=>{
    console.log("MongoDB connection error!!! ", err);
})
