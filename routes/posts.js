const router = require("express").Router();
const verify = require('./verifyToken');

router.get("/", verify, (req, res) => {
    res.json({
        user: req.user,
        posts: [
            {
                title: "My first post",
                description: "Random data you shouldn't access"
            }
        ]
    });
});

module.exports = router;
