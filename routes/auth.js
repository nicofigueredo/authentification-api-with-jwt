const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
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
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ msg: error.details[0].message.replace(/\"/g, "") });

    //Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ msg: "Email isn't registered" });

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({msg: "Invalid password"});

    res.send({msg: "Logged in Ok"});

});

module.exports = router;
