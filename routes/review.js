const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const reviews = require("../models/review.js");
const review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, isAuthor}= require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

//add review
router.post("/:id/reviews",isLoggedIn,reviewcontroller.addReview);

//Create Route
// router.post("/", isLoggedIn,wrapAsync (reviewcontroller.createReview));


//delete review route
router.delete("/:id/reviews/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewcontroller.deleteReview));

module.exports= router;