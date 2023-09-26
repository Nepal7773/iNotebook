const express = require('express');
const User = require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = "nepalisbadcfman"
//Route 1:  createUser
router.post('/createuser', [
    body('name', 'min length is 3').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })

], async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        success = false;
        return res.status(400).json({ success, error: error.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success = false;
            return res.status(400).json({ success, error: "sorry user with this is already exits" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // create  a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: { id: user.id }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error ocurred");
    }

})
// Route 2:  login
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be black').exists(),

], async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credential" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "please try to login with correct credential" });
        }

        const data = {
            user: { id: user.id }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

}
)

// Route 3 : get loggedin user details
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
}
)

module.exports = router;