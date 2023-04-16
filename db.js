const mongoose = require('mongoose')
// const mongoUri = 'mongodb://127.0.0.1/inotebook'
const mongoUri = 'mongodb+srv://Tanishq:rtyvkPVHwlsdjuMX@inotebook.bm98zhd.mongodb.net/?retryWrites=true&w=majority'



const connectToMongo = async ()=>{
    await mongoose.connect(mongoUri).then( console.log('Database connected'))
} 
  


module.exports = connectToMongo