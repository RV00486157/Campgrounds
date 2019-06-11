const Campground = require("../models/campground"),
	  Comment=require("../models/comment");
	
var middleObj = {};

middleObj.isLoggedIn=(req,res,next)=>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First!");
	res.redirect("/login");	
};

middleObj.checkCampgroundOwnership=(req,res,next)=>{
	//is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCampground)=>{
			if(err || !foundCampground){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				//is the logged in user, owner of the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
				
			}
		});	
	}else{
		req.flash("error","Please Login First!");
		res.redirect("back");
	}	
};

middleObj.checkCommentOwnership=(req,res,next)=>{
	//is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				res.redirect("back");
			}else{
				//is the logged in user, owner of the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
				
			}
		});	
	}else{
		req.flash("error","Please Login First!");
		res.redirect("back");
	}
};

module.exports=middleObj;