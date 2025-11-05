if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const review = require("./models/review.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
    
};

app.set("views", path.join(__dirname,"views"));
 app.set("view engine", "ejs");
 app.use(express.urlencoded({extended: true}));
 app.use(methodOverride("_method"));
 app.use(express.static(path.join(__dirname,"/public")));
 app.engine("ejs",ejsMate);

const store = MongoStore.create( {
 mongoUrl:dbUrl,
 crypto:{
  secret: process.env.SECRET, 
 },
 touchAfter: 24 * 3600 ,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

app.set("trust proxy", 1);

const sessionOption = {
  store,
  secret: process.env.SECRET || "mysupersecretcode1234567890abcdef",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};


app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://mern-stack-airbnb.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

 next();
});



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.get("/", (req, res) => {
  res.send("App is running");
});
 
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://mern-stack-airbnb.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.sendStatus(200);
});


app.use("/listings",listingRouter);
app.use("/listings",reviewRouter);

app.use("/",userRouter);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

