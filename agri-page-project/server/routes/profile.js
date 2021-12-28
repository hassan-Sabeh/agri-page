const router = require("express").Router();
const Business = require('../models/Business.model');
const Mongoose = require("mongoose");
const User = require("../models/User.model");
const perPage = 20;

//TODO: complete this route handler
//TODO: add session checker
router.get("/profile", (req, res, next) => {
    // if (!req.session.userId) {
    //     res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
    //     console.log("user not logged in");
    //     return;
    // }
    let page = 1;
    let skipPage = 0;
    if (req.query.page) {
        page =  req.query.page;
        skipPage = perPage*(page - 1);
    }
    // let valueMatch = new RegExp('OK');
    let aggregatePipeline = [{$skip: skipPage},{$limit: perPage},{$project: {businessName:1, region:1}}]
    //{$match: {region: {$regex: valueMatch}}
    if (req.query.region) {
        aggregatePipeline.unshift({$match: {region: req.query.region}});
    }
    Business.aggregate(aggregatePipeline)
        .then(function(dataFromDb) {
            console.log(dataFromDb);
            // res.render('profile/profile', {businessList: dataFromDb});
            res.send(dataFromDb);
        })
        .catch(error => {
            res.render('profile/profile', {errorMessage: `error loading businesses ${error}`});
            console.log({errorMessage: `error loading businesses ${error}`});
            return;
        })
} );

//view business details
//TODO check for client session -> uncoment
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

//adding/removing a business to favorites
router.post('/profile/favorites', (req, res, next) => {
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
    const favoriteBusinessId = req.body.businessId;
    const userId = req.session.userId;
    if (req.query.operation === "add"){
        User.findByIdAndUpdate(userId, {$push: {favorites: favoriteBusinessId}})
        .then((userFromDb) => {
            console.log('update favorites list ===>', userFromDb);
            res.send('business was added to favorites');
        })
        .catch(error => console.log('######### error ########## ', error))    
        return;
    } else {
        User.findByIdAndUpdate(userId, {$pull: {favorites: favoriteBusinessId}})
        .then((userFromDb) => {
            console.log('update favorites list ===>', userFromDb);
            res.send('business was removed from favorites');
        })
        .catch(error => console.log('######### error ########## ', error))
    }
 });

//get edit information
router.get('/profile/edit', (req, res, next) => {
    // if (!req.session.userId) {
    //     res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
    //     console.log("user not logged in");
    //     return;
    // }
    // console.log("=======================>>>>>>>>>",req.session.userId);
    User.findById({_id: req.session.userId})
        .then(function(userFromDb) {
            if (req.session.userType === "farmer") {
                Business.findById({_id: userFromDb.ownBusiness})
                    .then(function(ownBusinessFromDb) {
                        allUserInfo = [ownBusinessFromDb, userFromDb]
                        res.render('profile/edit', {allUserInfo: allUserInfo})
                    })
                    .catch(error => 
                        {
                        console.log("error getting edit info =====>", error)
                        res.redirect('/profile');        
                        return;
                    }
                        )
                }else {
                    res.render('profile/edit', {allUserInfo: userFromDb});
                }  
        })
        .catch(error => {
            console.log("error getting edit info =====>", error)
            res.redirect('/profile');
            return;
        })
});

//post the new information to edit
router.post('/profile/edit', (req, res, next) => {
        // if (!req.session.userId) {
    //     res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
    //     console.log("user not logged in");
    //     return;
    // }
    const {username, email} = req.body.userInfo;
    if (req.session.userType === "farmer") {
        const {businessId ,businessName, businessAddress, businessDescription} = req.body.businessInfo;
        const updateUserPromise = User.findByIdAndUpdate({_id: req.session.userId}, {username, email}, {new: true});
        const updateBusinessPromise = Business.findByIdAndUpdate(
            {_id: businessId}, {
                businessName,
                businessAddress,
                businessDescription
            }, {new: true});
        Promise.all([updateUserPromise, updateBusinessPromise])
            .then(values => {
                console.log('updated information ==>',values);
                res.redirect('/profile/edit');
            })
            .catch(error => {
                console.log("error updating information ==>", error);
                //error handling, (validation errors)
                
                return;
            })
    
    } else {
        User.findByIdAndUpdate({_id: req.session.userId}, {username, email}, {new: true})
            .then(userFromDb => {
                console.log("success updating user from DB => ", userFromDb);
                res.redirect('/profile/edit');
            })
            .catch(error => {
                console.log("error updating user information ==> ", error);
                //error handling validation errors
                
                res.redirect('/profile/edit');
                return;
            })
    }
});


module.exports = router;