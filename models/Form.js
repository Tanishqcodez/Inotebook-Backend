const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const FormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const Form = mongoose.model('Form', FormSchema)
Form.createIndexes();
module.exports = Form
