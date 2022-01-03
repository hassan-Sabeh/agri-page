const router = require("express").Router();
const Business = require('../models/Business.model');
const Mongoose = require("mongoose");
const User = require("../models/User.model");
const perPage = 20;

//TOTO uncomment session verifier
router.get("/profile", (req, res, next) => {
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
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
            const listOfRegions = [];
            console.log(dataFromDb);
            dataFromDb.forEach(el => {
                if (!listOfRegions.includes(el.region)) {
                    listOfRegions.push(el.region)
                }
            })
            //getting total number of businesses for pagination on profile page
            Business.count()
                .then(function(countBusinesses) {
                    const businessCount = Math.ceil(countBusinesses/perPage);
                    console.log(businessCount)
                    res.render('profile/profile', {data: {businessList: dataFromDb, regions: listOfRegions, businessCount: businessCount}});
                })
                .catch(error => {
                    res.render('profile/profile', {errorMessage: `error loading count businesses ${error}`});
                    console.log({errorMessage: `error loading count businesses ${error}`});
                })
        })
        .catch(error => {
            res.render('profile/profile', {errorMessage: `error loading businesses ${error}`});
            console.log({errorMessage: `error loading businesses ${error}`});
            return;
        })
} );

//view business details
router.get('/profile/business/:businessId', (req, res, next) => {
    //check if user already logged in
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        // res.send("you have to be logged in to view this")
        return;
    }
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

//view favorites businesses
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
            res.status(204).send();
            return;
        })
        .catch(error => console.log('######### error ########## ', error))    
        return;
    } else {
        User.findByIdAndUpdate(userId, {$pull: {favorites: favoriteBusinessId}})
        .then((userFromDb) => {
            console.log('update favorites list ===>', userFromDb);
            res.redirect('/profile/favorites');
        })
        .catch(error => console.log('######### error ########## ', error))
    }
 });

//get edit information
router.get('/profile/edit', (req, res, next) => {
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
    // console.log("=======================>>>>>>>>>",req.session.userId);
    User.findById({_id: req.session.userId})
        .then(function(userFromDb) {
            if (req.session.userType === "farmer") {
                Business.findById({_id: userFromDb.ownBusiness})
                    .then(function(ownBusinessFromDb) {
                        req.session.ownBusinessId = ownBusinessFromDb._id;
                        res.render('profile/edit', {data:{businessInfo: ownBusinessFromDb ,userInfo: userFromDb}})
                    })
                    .catch(error => 
                        {
                        console.log("error getting edit info =====>", error)
                        res.redirect('/profile');        
                        return;
                    }
                        )
                }else {
                    res.render('profile/edit', {userInfo: userFromDb});
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
    if (!req.session.userId) {
        res.render('auth/login', {errorMessage: "you have to be logged in to view this page"});
        console.log("user not logged in");
        return;
    }
    const {username, email} = req.body;
    if (req.session.userType === "farmer") {
        const { ignorUserName, ignorEmail, businessName, businessAddress, businessDescription} = req.body;
        const updateUserPromise = User.findByIdAndUpdate({_id: req.session.userId}, {username, email}, {new: true});
        const updateBusinessPromise = Business.findByIdAndUpdate(
            {_id: req.session.ownBusinessId}, {
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
                if (error instanceof Mongoose.Error.ValidationError) {
                    //TODO: add error handler to render user friendly error to signup page
                    res.status(500).render('profile/edit', {errorMessage: error})
                } else if (error.code === 11000){
                    res.status(500).render('profile/edit', {errorMessage: error})
                } else {
                    console.log("######## the error is here ##########", error);
                }
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
                if (error instanceof Mongoose.Error.ValidationError) {
                    //TODO: add error handler to render user friendly error to signup page
                    res.status(500).render('profile/edit', {errorMessage: error})
                } else if (error.code === 11000){
                    res.status(500).render('profile/edit', {errorMessage: error})
                } else {
                    console.log("######## the error is here ##########", error);
                }
                return;
            })
    }
});

router.get('/profile/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;