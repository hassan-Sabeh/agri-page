const router = require("express").Router();

const businessInfor = [
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },{
        businessName: "agri business",
        region: "agri region"
    },{
        businessName: "agri business",
        region: "agri region"
    },
    {
        businessName: "agri business",
        region: "agri region"
    },
]



router.get('/profile', (req, res, next) => {
    res.render("profile/profile", {businessInfo: businessInfor});
});
//{businessName: "hello"}

router.get('/favorites', (req, res, next) => {
    res.render('profile/favorites', {businessInfo: businessInfor});
});

router.get('/editProfile', (req, res, next) => {
    res.render('profile/editProfile', {businessInfo: businessInfor});
});


module.exports = router;