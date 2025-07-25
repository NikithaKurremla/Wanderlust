const Listing=require("../models/listing");


//Index Router
module.exports.index=async (req, res) => {
    // console.log(allListings);
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//New Route
module.exports.renderNewForm=(req, res) => {
  // console.log(req.user);
  res.render("listings/new.ejs");
}

//Show Route
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path:"reviews",populate:{
    path:"author",
  }})
  .populate("owner");
  // console.log(listing);
  if(!listing){
    req.flash("error","Listing you requested for does not exist ");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// Create Route
module.exports.createListing=async (req, res,next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  // console.log(url,"..",filename);
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing Created! ");
        res.redirect("/listings"); // Or wherever you want to redirect
      
};

//Edit Route
module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist ");
    return res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl});
};

//Update Route
module.exports.updateListing=async (req, res) => {
    let { id } = req.params; 
  // if(!req.body.listing){
  //   throw new ExpressError(400,"Send Valid data for listing");
  //  }
  let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });


  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
  // if (req.file) {
  //   listing.image = {
  //     url: req.file.path,
  //     filename: req.file.filename
  //   };
  // }
  // await listing.save();
   req.flash("success","Listing Updated! ");
  res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success","New Listing Deleted! ");
  res.redirect("/listings");
};