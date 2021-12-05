const router = require('express').Router()

router.get('/login', (req, res, next) => {
    res.render('auth/login');
})


router.post('/login', (req,res, next) => {
    //add authentication here
    //get the post request body username and password
    //username validation
    //password validation
    //all validated => render the profile page
})


module.exports = router;
