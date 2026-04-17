const express = require('express')
const { url } = require('node:inspector');
require('dotenv').config()
const {connect} = require('./config/mongodb')
const LoginController = require('./controller/LoginController')
const cors = require('cors')
const app = express();
const {updateBasicDetails} = require('./controller/UserController')
const userRouter = require('./router/router')

app.get('/',(req,res)=>{
    console.log(req.url)
})
app.use(express.json())
app.use(cors())

app.post('/login',LoginController.loginUser)
app.use('/users', userRouter);

const port = 3000;

app.listen(port,()=>{
    console.log(`server is starting localhost:${port}`)
    connect()
})