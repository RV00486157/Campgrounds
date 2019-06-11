var express=require("express"),
router=express.Router({mergeParams:true});
const Campground = require("../models/campground"),
	  Comment=require("../models/comment"),
	  Middleware = require("../middleware");

//Comment Routes

router.get("/new",Middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground) =>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {"campground": foundCampground});
		}
	});
});

router.post("/",Middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground) =>{
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash("error","Something went wrong");
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/"+ foundCampground._id);
				}
			});
				
		}
	});
});

router.get("/:comment_id/edit",Middleware.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campgrounds_id: req.params.id,comment: foundComment});
		}
	});		
});

router.put("/:comment_id",Middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});

});

router.delete("/:comment_id",Middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err)	{
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
		
	
});

module.exports=router;