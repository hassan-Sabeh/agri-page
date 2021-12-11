const router = require('express').Router()

router.get('/signuptransition', (req, res, next) => {
    res.render('auth/signuptransition');
})

router.get('/signupclient', (req, res, next) => {
    res.render('auth/signupclient');
})


router.get('/signupfarmer', (req, res, next) => {
    res.render('auth/signupfarmer');
})


module.exports = router;
