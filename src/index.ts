import express from 'express';
const uuid = require('uuid')
require('./database/mongoose')

const app = express()
const port = process.env.PORT

app.get('/',(req,res) => {
    console.log('Home Route')
    res.send(uuid.v4())
})

app.listen((port), () => {
    console.log(`On port ${port}`)
})