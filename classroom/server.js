const express = require("express");
const app = express();
const path = require("path");
const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const session = require("express-session");
const flash=require("connect-flash");
// const cookieParser =require("cookie-parser");
// app.use(cookieParser("secretcode"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Express Sessions
// 2
const sessionOptions={
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
     res.locals.errorMsg=req.flash("error");
     next();
});
app.get("/register",(req,res)=>{
    let {name= "anonymous"} =req.query;
    // console.log(req.session);
    req.session.name=name;
    // console.log(req.session.name);
    // res.send(name);
    
    if(name === "anonymous"){
        req.flash("error","user not registered ");
    }else{
        req.flash("success","user registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`hello,${req.session.name}`);
    // console.log(req.flash("success"));
    // res.locals.successMsg=req.flash("success");
    //  res.locals.errorMsg=req.flash("error");
    res.render("page.ejs",{name:req.session.name});
});

// 1 way
// app.use(session({
//     secret: "mysupersecretstring",
//     resave:false,
//     saveUninitialized:true
// }));

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });
//

// app.get("/test",(req,res)=>{
//     res.send("test sucessful!");
// })



// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");

// });
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
// res.send("sent you some cookies!");
// })

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi,${name}`);
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi,I am root!");
// });

// app.use("/users",users);
// app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listening to 3000");
});