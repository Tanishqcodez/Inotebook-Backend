const mongoose = require('mongoose')
// const mongoUri = 'mongodb://127.0.0.1/inotebook'
const mongoUri = 'mongodb+srv://Tanishq:rLOGH8y301jamhnW@inotebook.bm98zhd.mongodb.net/inotebook'



const connectToMongo = async ()=>{
    await mongoose.connect(mongoUri).then( console.log('Database connected'))
} 


module.exports = connectToMongo
