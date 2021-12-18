const router = require("express").Router();
const Business = require('../models/Business.model');
const Mongoose = require("mongoose");

router.get("/profile", (req, res, next) => {
    console.log("Session => User ID ======>", req.session.userId);
    console.log("Session => User ID ======>", req.session.userType);
    res.send("<h1>HELLO to your private page</h1>");
} );

//TODO: test the session if user logged in or not
router.get('/profile/:businessId', (req, res, next) => {
    //check if user already logged in
    if (req.session.userId) {
        res.render('login', {errorMessafe: "you have to be logged in to view this page"});
        // res.send("you have to be logged in to view this")
        return;
    }
    const businessId = req.params.businessId;
    //get the business to view.
    Business.findById(businessId)
        .then(function(businessFromDb) {
            if (!businessFromDb) {
                res.render('profile', {errorMessafe: "business does not exist"});
                // res.send("business does not exist")
                return;
            }
            res.render('businessDetail', {businessDetails: businessFromDb});
            // res.send({businessDetails: businessFromDb})
        })
        .catch(error => {
            if (error instanceof Mongoose.Error.CastError) {
                res.render('profile', {errorMessage: "invalide business ID"});
                // res.send('invalide business ID');
                return;
            }
            console.log('######### error ########## ', error);
            res.render('profile', {errorMessage: "an error occured check logs"});
        });
});

router.get('/profile/favorites', (req, res, next) => {
    if (req.session.userId) {
        res.render('login', {errorMessafe: "you have to be logged in to view this page"});
        // res.send("you have to be logged in to view this")
        return;
    }
    //Get the user from db to access the favorites array of objects
    //get t
});


module.exports = router;