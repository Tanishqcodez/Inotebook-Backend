const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser')
const JWT_SECRET = 'Harryisagoodb$oy';


//  Route 1: User endpoint, saving a new user and no login required. Post req: /api/auth/createuser
let success = false

router.post('/createuser', [
    body('name', 'Enter a vaild name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 char').isLength({ min: 5 })
],
    async (req, res) => {
        //Validating user entry points and saving in mongodb if no error
        // if there are error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false,errors: errors.array() });
        }
        try {
            //checking whether the email exits or not
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({success: false, error: "Sorry! A user already exits with this email!"})
            }
            const salt = await bcrypt.genSalt(10);

            const secPass = await bcrypt.hash(req.body.password, salt)
            //Creating a user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            const data = {
                id: user.id
            }


            const authToken = jwt.sign(data, JWT_SECRET)

            success = true
            res.json({ success ,authToken })


        } catch (error) {
            console.error(error.message)
            res.status(500).send('Some error occured')
        }

    })
//Route 2 : Authentication / Login a user using /api/auth/login. No login required
router.post('/login',
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()]
    ,
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        const { email, password } = req.body
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: 'Wrong username or password' })
            }

            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                success = false
                return res.status(400).json({ success, error: 'Wrong username or password' })
            }


            const data = {
                id: user.id
            }


            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.send({ success ,authToken })




        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server occured!')
        }
    }

)
// Route 3 : Get logged in user details using /api/auth/getuser.login required {JWT TOKEN}

router.post('/getuser', fetchUser , async (req, res) => {
        try {
            userId =  req.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal server occured!')
        }
    })





module.exports = router