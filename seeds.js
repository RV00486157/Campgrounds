const mongoose= require("mongoose"),
	  Campground= require("./models/campground"),
	  Comment= require("./models/comment");
var data=[
	{
		name:"Coorg",
		image:"http://blog.railyatri.in/wp-content/uploads/2018/06/Places-to-explore-in-Coorg.png",
		description: "Coorg is an beautiful city situated in karnataka."
	},
	{
		name:"Leh",
		image:"https://img.traveltriangle.com/blog/wp-content/uploads/2018/04/acj-2404-camping-in-leh-5.jpg",
		description: "Leh is one of the best mountain camping places in India."
	},
	{
		name:"kerala Munnar",
		image:"https://www.india.com/wp-content/uploads/2018/08/camp.jpg",
		description:"God's own country"
	}
];
function seedDB(){
	Campground.deleteMany({},(err)=>{
		if(err){
			console.log(err);
		}else{
			console.log("removed campgrounds");
		}
		data.forEach(seed=>{
		Campground.create(seed,(err,campground)=>{
			if(err){
				console.log(err);
			}else{
				console.log("added a campground");
				Comment.create({
					text:"This is an awesome place",
					author:"George"
				},(err,comment)=>{
					if(err){
						console.log(err);
					}else{
						campground.comments.push(comment);
						campground.save();	
						console.log("Comment added");
					}
					
				});
			}
		});
	});
	});
	
	
}

module.exports=seedDB;