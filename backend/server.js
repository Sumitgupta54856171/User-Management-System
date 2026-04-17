const express = require('express')
const { url } = require('node:inspector');
require('dotenv').config()
const {connect} = require('./config/mongodb')

const app = express();

app.get('/',(req,res)=>{
    console.log(req.url)
})

const port = 3000;

app.listen(port,()=>{
    console.log(`server is starting localhost:${port}`)
    connect()
})