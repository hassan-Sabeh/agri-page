const router = require("express").Router();

// router.get("/", (req, res, next) => {
//   res.json("All good in here");
// });

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

router.get("/", function(req, res, next) {
  res.render('index');
})

module.exports = router;
