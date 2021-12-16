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
]



router.get('/profile', (req, res, next) => {
    res.render("profile");
});

router.get('/profilebusiness', (req, res, next) => {
    res.render("profilebusiness", {businessInfo: businessInfor});
});


module.exports = router;