var express=require("express"),
	router=express.Router(),
	passport=require("passport");
const User = require("../models/user");

//Routes
router.get("/", function(req,res){
    res.render("home");
});

//Auth Routes

router.get("/register",(req,res)=>{
	res.render("register");
});

router.post("/register",(req,res)=>{
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Welcome to Yelpcamp " + newUser.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login",(req,res)=>{
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),(req,res)=>{
	
});

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Successfully Logged out");
	res.redirect("/campgrounds");
});

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

module.exports=router;