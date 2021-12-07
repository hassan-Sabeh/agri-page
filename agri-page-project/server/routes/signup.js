const router = require('express').Router()
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
const Mongoose = require("mongoose");


router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
    //validate the user is unique
    //validate all required fields
    const {username, userType, email, ownBusiness, favorites, password} = req.body;
    if (!username || !userType || !email || !password) {
        res.render('signup', {errorMessage: "mandatory fields should not be empty"});
    }
    // hashing the password with bcryptjs
    const hashPassword = bcryptjs.hashSync(password, salt);
    User.create(
        username,
        userType, 
        email, 
        ownBusiness, 
        favorites, 
        hashPassword
    )
    .then(function(userFromDb) {
        // create the session object with user_id field
        res.redirect('/profile')
    })
    .catch(erro => {
        //if handlers for error messages from the database.
        if (error instanceof Mangoose.Error.ValidationError) {

        }
    });
    //create the User model on the database
    //render the profile page.
})



module.exports = router;
