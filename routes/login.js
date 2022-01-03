const router = require('express').Router()
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
const Mongoose = require("mongoose");
const { render } = require('../app');


router.get('/login', (req, res, next) => {
    res.render('auth/login', {errorMessage: ""});
});


router.post('/login', (req,res, next) => { 
    const {email, password} = req.body;
    //input data validation
    if (!email || !password) {
        res.render('auth/login', {errorMessage: "username or password not given"});
        return;
    }
    //Checking if user exists in the db
    User.findOne({email: email})
        .then(function(userFromDb) {
            if (!userFromDb) {
                console.log('email not registered');
                res.render('auth/login', {errorMessage: "email not registered"});
                return;
            } else if (!bcryptjs.compareSync(password, userFromDb.hashPassword)) {
                console.log('wrong password');
                res.render('auth/login', {errorMessage: "invalid password"});
                return;
            }  else {
                //create user session
                req.session.userId = userFromDb._id;
                console.log("=======================>>>>>>>>>",req.session.userId);
                req.session.userType = userFromDb.userType;
                console.log("welcome to your profile");
                res.redirect('/profile');
            } 

        })
        .catch(error => {console.log("######error###### ", error)})
        // .next()
});


module.exports = router;
