require('dotenv').config()

const mongoose = require('mongoose')

const databaseConnect = () => {
    mongoose
    .connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`connected to DB ${conn.connection.host}`))
    .catch((err) => console.log(err.message))
}

module.exports = databaseConnect



