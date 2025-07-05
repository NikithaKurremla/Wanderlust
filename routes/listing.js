const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchema}=require("../schema.js");
// const ExpressError =require("../utils/ExpressError.js")
// const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


// controllers
const listingController=require("../controllers/listings.js");

//index and create are under same Route("/")
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
      isLoggedIn, 
      validateListing,  
      wrapAsync(listingController.createListing)
    );
    //New Route
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);

    //show,Updata,Delete
router
.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(
  isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(listingController.updateListing)
  )
  .delete(
  isLoggedIn,
  isOwner,
   wrapAsync( listingController.destroyListing)
  )


//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



// //Index Route
//   router .get("/",wrapAsync(listingController.index));


//Show Route
// router.get(
//   "/:id", 
//   wrapAsync( listingController.showListing)
// );

//create
// New and working
// router.post(
//   "/",
//   isLoggedIn, 
//   validateListing,  
//   wrapAsync(listingController.createListing)
// );



// //Update Route
// router.put(
//   "/:id",
//    isLoggedIn,
//    isOwner,
//    validateListing,
//    wrapAsync(listingController.updateListing)
//   );

// //Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//    wrapAsync( listingController.destroyListing)
//   );


module.exports = router;

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

//    if(!req.body.listing){
//     throw new ExpressError(400,"Send Valid data for listing");
//    }
//     const { title, description, price, location, country, image } = req.body.listing;
    
    
//     let result=listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//       throw new ExpressError(400,result.error);
//     }
    

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

