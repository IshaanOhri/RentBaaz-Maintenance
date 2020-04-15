import express from 'express';
const uuid = require('uuid')
require('./database/mongoose')
const auth = require('./routes/auth')
const user = require('./routes/user')
const query = require('./routes/query')

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use(auth);
app.use(user);
app.use(query);

app.get('/',(req,res) => {
    console.log('Home Route')
    res.send(uuid.v4())
})

app.listen((port), () => {
    console.log(`On port ${port}`)
})