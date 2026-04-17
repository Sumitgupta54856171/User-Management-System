const mongoose = require('mongoose')


const connect =async()=>{
    mongoose
    .connect(process.env.mongodb_url)
    .then(()=>{
        console.log("successfuly connected the mongodb server")
    })
    .catch((error)=>{
        console.log(`show the server error in the mongodb ${error}`)
    })
}
module.exports={connect}