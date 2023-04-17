const connectToMongo = require('./db')
const express = require('express')
const Form = require('./models/Form')
const { body, validationResult } = require('express-validator');
var cors = require('cors')
connectToMongo()
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())


let success = false
//Avail routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// Contact form route

app.post('/sumbitform', [
    body('name', 'Enter a vaild name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('desc', 'Description must be atleast 5 char').isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { name, email, desc } = req.body
    form = await Form.create({
        name: name,
        email: email,
        desc: desc
    })

    res.send({success: true})
})

app.listen(port, () => {
    console.log(`Inotebook backend listening on port ${port}`)
})