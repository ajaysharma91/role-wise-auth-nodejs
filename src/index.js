import express from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import consola from 'consola'

import passport from 'passport'
//Import Application Constant

import { DB, PORT } from './constant'

//Router import
import userApis from './apis/users'

// Import passport middleware

require('./middleware/passport.middleware')
const app = express()

//Apply Middleware

app.use(cors())
app.use(json())
app.use(passport.initialize())

app.use('/v1',userApis)

const main = async() => {
    console.log("AJAY")
    try {
        // connecting with db
        // start application listining for request on server
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        }
        )
        consola.success("DataBase connected")
        app.listen(PORT,()=>{consola.success(`Server Running on Port ${PORT}`)})
    } catch (err) {
        consola.error(`unable to start application \n ${err.message}`)
     }
}
main()
