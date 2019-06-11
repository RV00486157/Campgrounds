var express=require("express"),
router=express.Router();
const Campground = require("../models/campground");
const Middleware = require("../middleware");
//INDEX
router.get("/", function(req,res){
    Campground.find({},(err,campgrounds) =>{
		if(err){
			req.flash("error","Campground not found");
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds : campgrounds});
		}
	});
	
    //res.render("campgrounds",{campgrounds : campgrounds});
});

//NEW
router.get("/new",Middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

//CREATE
router.post("/",Middleware.isLoggedIn,function(req,res){
    var author = {
		id: req.user._id,
		username:req.user.username
	};
	
	var newCamp = new Campground({
		name: req.body.name,
		image: req.body.url,
		description: req.body.desc,	
		author: author,
		price:req.body.price
	});
	
	
		newCamp.save((err,campground)=>{
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
    //campgrounds.push(newCamp);
});

//SHOW
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) =>{
		if(err){
			req.flash("error","Campground not found");
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show", {"campground": foundCampground});
		}
	});	
});

//EDIT
router.get("/:id/edit",Middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
		res.render("campgrounds/edit",{campground: foundCampground});	
		});
});

//UPDATE
router.put("/:id",Middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,campground)=>{
		if(err){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE
router.delete(":/id",Middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports=router;