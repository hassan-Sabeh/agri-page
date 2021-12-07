const router = require('express').Router()
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
const Mongoose = require("mongoose");


router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {data: "SignUp Page"});
    // res.send('<h2>SignUp Page</h2>');
})

router.post('/signup', (req, res, next) => {
    //validate the user is unique
    //validate all required fields
    const {username, userType, email, ownBusiness, favorites, password} = req.body;
    // console.log(req.body);
    if (!username || !userType || !email || !password) {
        res.render('auth/signup', {errorMessage: "mandatory fields should not be empty"});
        return;
    }
    // hashing the password with bcryptjs
    const hashPassword = bcryptjs.hashSync(password, salt);
    User.create(
        {username,
        userType, 
        email, 
        ownBusiness, 
        favorites, 
        hashPassword}
    )
    .then(function(userFromDb) {
        // create the session object with user_id field
        res.redirect('/profile')
    })
    .catch(error => {
        //if handlers for error messages from the database.
        if (error instanceof Mongoose.Error.ValidationError) {
            //TODO: add error handler to render user friendly error to signup page
            res.status(500).render('auth/signup', {errorMessage: error})
        } else if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Email already exists'})
        } else {
            console.log("######## the error is here ##########");
            next(error);
        }
    });
    //create the User model on the database
    //render the profile page.
});



module.exports = router;
