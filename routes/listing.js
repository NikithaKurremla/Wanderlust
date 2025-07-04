const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchema}=require("../schema.js");
// const ExpressError =require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


//Index Route
router.get("/",  wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  // console.log(allListings);
}));

//New Route
router.get("/new",
   isLoggedIn,
   (req, res) => {
  // console.log(req.user);
  
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate("reviews")
  .populate("owner");
  // console.log(listing);
  if(!listing){
    req.flash("error","Listing you requested for does not exist ");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


// Create Route
//1(main to add image)
// router.post("/listings", async (req, res) => {
//   const newListing=new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
//   // 2.
//   // // const listingData = new Listing(req.body.listing);
//   // listingData.image = {
//   //   filename: "listingimage",
//   //   url: listingData.imageUrl
//   // };
//   // delete listingData.imageUrl;
//   // const newListing = new Listing(listingData);
//   // await newListing.save();
//   // res.redirect("/listings");
// });

router.post("/",
  isLoggedIn,
  validateListing, 
  wrapAsync(async (req, res,next) => {

//    if(!req.body.listing){
//     throw new ExpressError(400,"Send Valid data for listing");
//    }
//     const { title, description, price, location, country, image } = req.body.listing;
    
    
//     let result=listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//       throw new ExpressError(400,result.error);
//     }
    const newListing= new Listing(req.body.listing);

    // const newListing = new Listing({
    //   title,
    //   description,
    //   price,
    //   location,
    //   country,
    //   image: {
    //     url: image.url, // Ensure you're passing the object structure
    //     filename: image.filename ||"listingimage", // Default filename (optional)
    //   }
    // });
    
    // console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created! ");
    res.redirect("/listings"); // Or wherever you want to redirect
  
}));

//Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
    wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist ");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
   wrapAsync(async (req, res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400,"Send Valid data for listing");
  //  }
  

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success","Listing Updated! ");
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",
  isLoggedIn,
  isOwner,
   wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success","New Listing Deleted! ");
  res.redirect("/listings");
}));




module.exports = router;