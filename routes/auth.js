const router = require("express").Router();
const User = require("../model/User");
const { registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    //Validation before user creation
    const { error } = registerValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ msg: error.details[0].message.replace(/\"/g, "") });

    //Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    //Check if the user is already in the database
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
        return res.status(400).send({ msg: "Email already registered" });

    try {
        const savedUser = await user.save();
        res.send({ _id: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
