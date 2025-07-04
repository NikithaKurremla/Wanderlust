const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
// const {reviewSchema}=require("../schema.js");
// const ExpressError =require("../utils/ExpressError.js")
// const Listing = require("../models/listing.js");
// const Review=require("../models/review.js");
const { validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

//controller
const reviewController=require("../controllers/reviews.js");


//Reviews
//Reviews Post Routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete review Route
router.delete(
  "/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
  wrapAsync(reviewController.destroyReview));


module.exports = router;
