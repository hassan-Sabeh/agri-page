const router = require('express').Router()

router.get('/signuptransition', (req, res, next) => {
    res.render('auth/signuptransition');
})

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

module.exports = router;
