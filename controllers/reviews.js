const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.addReview = async (req,res) =>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new review(req.body.review);
 newReview.author = req.user._id;
 console.log(newReview);
 listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","Review Added Successfully");
  res.redirect(`/listings/${listing._id}`);
};

// module.exports.createReview = async(req,res,next) =>{
    
//  let response =  await geocodingClient.forwardGeocode({
//   query: req.body.listing.location,
//   limit: 1,
// })
//   .send();

//      let url = req.file.path;
//      let filename = req.file.filename;
//      const newListing = new Listing(req.body.listing);
//      newListing.owner = req.user._id;
//     newListing.image = {url,filename};

//     newListing.geometry = response.body.features[0].geometry;
//     let save = await newListing.save();
//    console.log(save);

//     req.flash("success","New Listing Created");
//     res.redirect("/listings");
// };

module.exports.deleteReview = async (req,res) =>{
     let{id,reviewId} = req.params;
 
     await Listing.findByIdAndUpdate(id, {$pull :{ reviews: reviewId}});
     await review.findById(reviewId);
     req.flash("success","Review Deleted Successfully");
     res.redirect(`/listings/${id}`);
    };