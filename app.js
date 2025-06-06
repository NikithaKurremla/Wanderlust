const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings",  wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  // console.log(allListings);
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
}));

//Create Route
// app.post("/listings", async (req, res) => {
//   const newListing=new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
//   // 2.
//   // const listingData = new Listing(req.body.listing);
//   // listingData.image = {
//   //   filename: "listingimage",
//   //   url: listingData.imageUrl
//   // };
//   // delete listingData.imageUrl;
//   // const newListing = new Listing(listingData);
//   // await newListing.save();
//   // res.redirect("/listings");
// });

app.post("/listings", wrapAsync(async (req, res,next) => {
   if(!req.body.listing){
    throw new ExpressError(400,"Send Valid data for listing");
   }
    const { title, description, price, location, country, image } = req.body.listing;
    
    // if (!title || !description || !price || !location || !country || !image) {
    //   return next(new ExpressError(400, "Page Not Found!"));
    // }
    // const newListing= new Listing(req.body.listing);

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: {
        url: image.url, // Ensure you're passing the object structure
        filename: image.filename ||"listingimage", // Default filename (optional)
      }
    });
     if(!newListing.title){
      throw new ExpressError(400,"Title is missing");
     }
     if(!newListing.description){
      throw new ExpressError(400,"Description is missing");
     }
     if(!newListing.location){
      throw new ExpressError(400,"Location is missing");
     }
    
    
    await newListing.save();
    res.redirect("/listings"); // Or wherever you want to redirect
  
}));

//Edit Route
app.get("/listings/:id/edit",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",  wrapAsync(async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"Send Valid data for listing");
   }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// app.all("*",(req,res,next)=>{
//   next( new ExpressError(404,"Page Not Found!"));
// });
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});