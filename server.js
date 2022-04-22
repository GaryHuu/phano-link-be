require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/userRouter')

const app = express()
app.use(express.json())

const URL = process.env.MONGOBD_URL
mongoose.connect(URL, (err) => {
  if (err) throw err
  console.log("Connected to MongoDB success")
})

app.use('/api/users', userRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server started'))
