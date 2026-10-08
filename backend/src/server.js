import express from "express"
import {ENV} from "./lib/env.js"

import authRoutes from "./routes/auth.route.js"


const app = express()

const PORT = ENV.PORT || 3000

app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    //connectDB()
})