const router = require("express").Router();

router.get('/profile', (req, res, next) => {
    res.render("profile");
});

router.get('/profilebusiness', (req, res, next) => {
    res.render("profilebusiness");
});


module.exports = router;