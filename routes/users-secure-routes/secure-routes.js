const express = require("express");

const router = express.Router();

//Displays information tailored according to the logged in user
router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.JWT,
  });
});

module.exports = router;
