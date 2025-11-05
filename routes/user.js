const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usercontroller = require("../controllers/users.js");

router.get("/signup",usercontroller.signup);

router.post("/signup",wrapAsync(usercontroller.postSignup));

router.get("/login",usercontroller.login);


router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", { 
    failureRedirect: "/login",
    failureFlash: true 
  }),
  (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  }
);


router.get("/logout",usercontroller.logout);

module.exports = router;