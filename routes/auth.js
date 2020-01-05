const router = require("express").Router();
const User = require("../model/User");
const { registerValidation } = require("../validation");

router.post("/register", async (req, res) => {
    //Validation before user creation
    const { error } = registerValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ msg: error.details[0].message.replace(/\"/g, "") });

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();
        res.send({ _id: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
