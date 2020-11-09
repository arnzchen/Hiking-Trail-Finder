const express = require("express");
const router = express.Router();
const Trail = require("../models/trail");
const Comment = require("../models/comment");
const isLoggedIn = require("../utils/isLoggedIn");
const checkTrailOwner = require("../utils/checkTrailOwner");

// Index
router.get("/", async (req, res) => {
	console.log(req.user);
	try {
		const trails = await Trail.find().exec();
		res.render("trails", {trails});
	} catch (err) {
		res.send("err");
	}
})

// Create
router.post("/", isLoggedIn, async (req, res) => {
	console.log(req.body);
	const landscape = req.body.landscape.toLowerCase();
	const newTrail = {
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		difficulty: req.body.difficulty,
		landscape,
		date: req.body.date,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		upvotes:[req.user.username],
		downvotes:[]
	}
	
	try {
		const trail = await Trail.create(newTrail);
		req.flash("success", `${trail.title} trail created!`);
		res.redirect(`/trails/${trail._id}`);
	} catch (err) {
		req.flash("error", "Error creating trail");
		res.redirect("/trails");
	}
})

//New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("trails_new");
})

//Search
router.get("/search", async (req, res) => {
	try {
		const trails = await Trail.find({
			$text: {
				$search: req.query.term
			}
		})
		res.render("trails", {trails});
	} catch (err) {
		res.send("Error - trails.js search")
	}
}) 

//Landscape
router.get("/landscape/:landscape", async (req, res) => {
	const validLandscapes = ["mountains", "oceans", "forests", "plains", "lakes"];    
	if (validLandscapes.includes(req.params.landscape.toLowerCase())) {
		const trails = await Trail.find({landscape: req.params.landscape}).exec();
		res.render("trails", {trails});
	} else {
		res.send("Please enter a valid landscape");
	}
});

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
	console.log(req.body);
	
	const trail = await Trail.findById(req.body.trailId);
	const alreadyUpvoted = trail.upvotes.indexOf(req.user.username);
	const alreadyDownvoted = trail.downvotes.indexOf(req.user.username);
	
	let response = {};
	if (alreadyUpvoted === -1 && alreadyDownvoted === -1) {
		if (req.body.voteType === "up") {
			trail.upvotes.push(req.user.username);
			trail.save();
			response.message = "Upvoted!"
		} else if (req.body.voteType === "down") {
			trail.downvotes.push(req.user.username);
			trail.save();
			response.message = "Downvoted!"
		} else {
			response.message = "not yet voted error"
		}
	} else if (alreadyUpvoted !== -1) {
		trail.upvotes.splice(alreadyUpvoted, 1);
		if (req.body.voteType === "up") {
			response.message = "Upvote Removed!"
		} else if (req.body.voteType === "down") {
			trail.downvotes.push(req.user.username);
			response.message = "Downvoted!"
		} else {
			response.message = "already upvoted error"
		}
		trail.save();
	} else if (alreadyDownvoted !== -1) {
		trail.downvotes.splice(alreadyDownvoted, 1);
		if (req.body.voteType === "up") {
			trail.upvotes.push(req.user.username);
			response.message = "Upvoted!"
		} else if (req.body.voteType === "down") {
			response.message = "Downvote Removed!"
		} else {
			response.message = "already downvoted error"
		}
		trail.save();
	} else {
		response.message = "voted error"
	}
	
	res.json(response);
})


//Show
router.get("/:id", async (req, res) => {
	try {
		const trail = await Trail.findById(req.params.id).exec();
		const comments = await Comment.find({trailId: req.params.id});
		res.render("trails_show", {trail, comments});
	} catch (err) {
		res.send("Error");
	}
})


//Edit
router.get("/:id/edit", isLoggedIn, checkTrailOwner, async (req, res) => {
	const trail = await Trail.findById(req.params.id).exec();
	res.render("trails_edit", {trail});
})

//Update
router.put("/:id", isLoggedIn, checkTrailOwner, async (req, res) => {
	const landscape = req.body.landscape.toLowerCase();
	const trailBody = {
		title: req.body.title,
		description: req.body.description,
		location: req.body.location,
		difficulty: req.body.difficulty,
		landscape,
		date: req.body.date,
		image: req.body.image
	}
	
	try {
		const trail = await Trail.findByIdAndUpdate(req.params.id, trailBody, {new: true}).exec();
		req.flash("success", "trail updated successfully!");
		res.redirect(`/trails/${req.params.id}`);
	} catch (err) {
		req.flash("error", "Error updating trail");
		res.redirect("/trails");
	}
})

//Delete
router.delete("/:id", isLoggedIn, checkTrailOwner, async (req, res) => {
	try {
		const trail = await Trail.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "trail deleted successfully!");
		res.redirect("/trails");
	} catch (err) {
		req.flash("error", "Error deleting trail");
		res.redirect("back");
	}
})


module.exports = router;
