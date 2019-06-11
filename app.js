const express = require("express"),
	app = express(),
	bodyParser= require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride= require("method-override"),
	flash= require("connect-flash"),
	dotenv = require('dotenv');


dotenv.config();

var campgroundRoutes = require("./routes/campgrounds"),
  	commentRoutes = require("./routes/comments"),
	indexRoutes=require("./routes/index");
//mongoose.connect("mongodb://localhost/yelpcamp_v9",{useNewUrlParser: true});
const password = process.env.PASSWORD;
mongoose.connect("mongodb+srv://user_rev:"+password+"@cluster0-crjfc.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useCreateIndex:true
}).then(()=>{
	console.log("Connected to DB");
}).catch(err=>{
	console.log(err.message);
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration

app.use(require("express-session")({
	secret : "I love dogs",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//seedDB();
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//Listening to server
// app.listen(3000,()=>{
// 	console.log("Server running v9.1");
// });

var server_port = process.env.PORT || 3000;
var server_host = '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});

