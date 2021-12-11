const router = require('express').Router()

router.get('/signupclient', (req, res, next) => {
    res.render('auth/signupclient');
})


router.get('/signupfarmer', (req, res, next) => {
    res.render('auth/signupfarmer');
})


module.exports = router;
