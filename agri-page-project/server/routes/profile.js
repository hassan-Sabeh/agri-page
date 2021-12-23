const router = require("express").Router();
const Business = require('../models/Business.model');
const Mongoose = require("mongoose");
const User = require("../models/User.model");

//TODO: complete this route handler
//TODO: add session checker
router.get("/profile", (req, res, next) => {
    console.log("Session => User ID ======>", req.session.userId);
    console.log("Session => User ID ======>", req.session.userType);
    // res.send("<h1>HELLO to your private page</h1>");
    res.render('profile/profile', {});
} );

//view business details
router.get('/profile/business/:businessId', (req, res, next) => {
    //check if user already logged in
    // if (!req.session.userId) {
    //     res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
    //     console.log("user not logged in");
    //     // res.send("you have to be logged in to view this")
    //     return;
    // }
    const businessId = req.params.businessId;
    //get the business to view.
    Business.findById(businessId)
        .then(function(businessFromDb) {
            if (!businessFromDb) {
                res.render('profile/profile', {errorMessage: "business does not exist"});
                console.log('business does not exist');
                // res.send("business does not exist")
                return;
            }
            res.render('profile/businessDetails', {businessDetails: businessFromDb});
            console.log({businessDetails: businessFromDb});
            // res.send({businessDetails: businessFromDb})
        })
        .catch(error => {
            if (error instanceof Mongoose.Error.CastError) {
                res.render('profile/profile', {errorMessage: "invalide business ID"});
                console.log({errorMessage: "invalide business ID"})
                // res.send('invalide business ID');
                return;
            }
            console.log('######### error ########## ', error);
            res.render('profile/profile', {errorMessage: "an error occured check logs"});
        });
});

//view favorite businesses
router.get('/profile/favorites', (req, res, next) => {
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
    userId = req.session.userId;
    User.findById(userId)
        .then(function(userFromDb) {
            if (!userFromDb) {
                console.log('ID does not exist');
                res.render('/profile/profile', {errorMessage: "ID does not exist"});
                return;
            } else if (userFromDb.favorites.length === 0) {                                          
                console.log("user does not have favorites");
                res.render('profile/favorites', {errorMessage: "you do not have favorites"});
                return;
            } else {
                console.log("here are your favorites");
                const promiseStack = [];
                userFromDb.favorites.forEach(favoriteId => {
                    promiseStack.push(Business.findById(favoriteId))
                } );
                Promise.all(promiseStack)
                    .then((values) => {
                        res.render('profile/favorites', {favoritesList: values});
                        console.log({favoritesList: values});
                    })
                    .catch(error => console.log("error in favorite promises =>", error))
            }
        })
        .catch(error => {
            if (error instanceof Mongoose.Error.CastError) {
                res.render('profile/profile', {errorMessage: `=> ${error}`});
                // res.send('invalide business ID');
                return;
            }
            console.log('######### error ########## ', error);
            res.render('profile/profile', {errorMessage: "an error occured check logs"});
        })
});

//adding a business to favorites
router.post('/profile/favorites', (req, res, next) => {
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
    const favoriteBusinessId = req.body.businessId;
    const userId = req.session.userId;
    User.findByIdAndUpdate(userId, {$push: {favorites: favoriteBusinessId}})
        .then((userFromDb) => {
            console.log('update favorites list ===>', userFromDb);
            res.send('business was added to favorites');
        })
        .catch(error => console.log('######### error ########## ', error))
 });


module.exports = router;