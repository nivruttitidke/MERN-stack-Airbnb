const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const reviews = require("../models/review.js");
const review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}= require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingControler = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage });
const reviewcontroller = require("../controllers/reviews.js");


router
.route("/")
.get(wrapAsync(listingControler.index))
.post( isLoggedIn,upload.single('listing[image]'),wrapAsync (listingControler.createListing));



//new and crete route
router.get("/new", isLoggedIn,listingControler.renderNewForm);

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingControler.renderEdit));

router
.route("/:id")
.get( wrapAsync(listingControler.renderShow))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),
wrapAsync(listingControler.renderUpdate)
)
.delete( isLoggedIn ,isOwner,wrapAsync (listingControler.renderDelete));


module.exports= router;