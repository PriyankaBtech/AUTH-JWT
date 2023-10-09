
const express = require('express')
const app = express()
const authRouter = require('./router/authRoute.js')
const connectToDB = require('./config/databaseConfig.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
connectToDB()

app.use(cookieParser())
app.use('/api/auth/', authRouter)
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/', (req, res) => {
    res.status(200).json({data : 'JWTauth server'})
})

module.exports = app