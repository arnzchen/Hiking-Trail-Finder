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
		}
	}
	
	try {
		const trail = await Trail.create(newTrail);
		res.redirect(`/trails/${trail._id}`);
	} catch (err) {
		res.send("err");
	}
})


router.get("/new", isLoggedIn, (req, res) => {
	res.render("trails_new");
})

//search
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
		res.redirect(`/trails/${req.params.id}`);
	} catch (err) {
		console.log("here");
		res.send("Error");
	}
})

router.delete("/:id", isLoggedIn, checkTrailOwner, async (req, res) => {
	try {
		const trail = await Trail.findByIdAndDelete(req.params.id).exec();
		res.redirect("/trails");
	} catch (err) {
		res.send("Error deleting:");
	}
})


module.exports = router;
