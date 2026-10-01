// require('dotenv').config({path:'./env'})
// Must load first: app.js reads env (e.g. CORS_ORIGIN) at import time
import "dotenv/config";
import connectDB from "./db/index.js";
import{app} from './app.js'


connectDB()
.then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`⚙️  Server is running at port : ${port} `)
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!!", error)
})

/*

    <<  1st Approch to connect with data base >>

import express from 'express';
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
       console.error("ERROR", error) 
       throw error
    }
})()

*/
