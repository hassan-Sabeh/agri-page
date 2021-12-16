const router = require("express").Router();

router.get("/profile", (req, res, next) => {
    console.log("Session => User ID ======>", req.session.userId);
    res.send("<h1>HELLO to your private page</h1>");
} );

module.exports = router;