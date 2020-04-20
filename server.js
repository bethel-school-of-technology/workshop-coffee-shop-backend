require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

// SETUP DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


// PRODUCT ROUTES
const productRoutes = require('./routes/product')
app.use('/products', productRoutes)

// USER ROUTES
const userRoutes = require('./routes/user')
app.use('/users', userRoutes)


app.listen(3000, () => console.log('server started'))