const router = require('express').Router()
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
const Mongoose = require("mongoose");
const dbConn = require('../db/index');
const Business = require('../models/Business.model');


router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {data: "SignUp Page"});
    // res.send('<h2>SignUp Page</h2>');
})

//TODO, refactor code, duplication for User.create...
router.post('/signup', (req, res, next) => {
    data = req.body;
    if (data.userType === "client"){
        if (!data.username || !data.userType || !data.email || !data.password) {
            res.render('auth/signup', {errorMessage: "mandatory fields should not be empty"});
            return;
        }        
        // hashing the password with bcryptjs
        const hashPassword = bcryptjs.hashSync(data.password, salt);
        User.create(
            {
            username: data.username,
            userType: data.userType, 
            email: data.email, 
            ownBusiness: data.ownBusiness, 
            favorites: data.favorites, 
            hashPassword: hashPassword
            })
        .then(function(userFromDb) {
            // create the session object with user_id field
            // req.session.userId = userFromDb._id;
            res.redirect('/profile');
            return;
        })
        .catch(error => {
            //if handlers for error messages from the database.
            if (error instanceof Mongoose.Error.ValidationError) {
                //TODO: add error handler to render user friendly error to signup page
                res.status(500).render('auth/signup', {errorMessage: error});
                return;
            } else if (error.code === 11000){
                res.status(500).render('auth/signup', {errorMessage: 'Email already exists'});
                return;
            } else {
                console.log("######## the error is here ##########");
                next(error);
            }
        });
        return;
    }
    /*
     ELSE => user is a farmer, create db session transaction for User.create and Business.create
    */
    // hashing the password with bcrypt
    const hashPassword = bcryptjs.hashSync(data.password, salt);
    
    async function registerFarmer(){
        console.log(data.username);
        const session = await dbConn.startSession();
        try {
            session.startTransaction();
            //!! returns an array
            const user = await User.create(
                [{
                username: data.username,
                userType: data.userType, 
                email: data.email, 
                ownBusiness: data.ownBusiness, 
                favorites: data.favorites, 
                hashPassword: hashPassword
                }], {session});
            //!! returns an array
            const business = await Business.create(
                [{
                ownerId: null, 
                businessName: data.businessName,
                businessAddress: data.businessAddress,
                businessCoordinates: null, //To be populated when the address is given or on the frontend with Axios
                businessDescription: data.businessDescription,
                region: data.region
            }], {session})

            await session.commitTransaction();
            //create the user session
            //update the IDs of the business and the users accordingly on the db
            // req.session.userId = user._id;
            console.log("##########", user[0]._id)
            Business.findOneAndUpdate({businessName: business[0].businessName}, {ownerId: user[0]._id}, {new: true})
                .then(function(businessFromDb){console.log(businessFromDb)})
                .catch(error => console.log(error))
            
            User.findOneAndUpdate({email: user[0].email}, {ownBusiness: business[0]._id}, {new: true})
                .then(function(userFromDb) {console.log(userFromDb)})
                .catch(error => console.log(error))

            res.redirect('/profile');
        } catch (error) {
            if (error instanceof Mongoose.Error.ValidationError) {
                //TODO: add error handler to render user friendly error to signup page
                res.status(500).render('auth/signup', {errorMessage: error})
            } else if (error.code === 11000){
                res.status(500).render('auth/signup', {errorMessage: error})
            } else {
                console.log("######## the error is here ##########", error);
                next(error);
            }
            await session.abortTransaction();
        } 
        session.endSession();
    }
    registerFarmer();

});



module.exports = router;