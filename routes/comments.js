const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Trail = require("../models/trail");
const isLoggedIn = require("../utils/isLoggedIn");
const checkCommentOwner = require("../utils/checkCommentOwner");

router.get("/new", isLoggedIn, (req, res) => {
	res.render("comment_new", {trailId: req.params.id, user: req.user});
})

// Create comment
router.post("/", isLoggedIn, async (req, res) => {
	try {
	const comment = Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		trailId: req.body.trailId
	})
	res.redirect(`/trails/${req.body.trailId}`);
	} catch (err) {
		res.send("Error - comments.js 18")
	}
})


router.get("/:commentId/edit", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const trail = await Trail.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("comment: ", comment);
		res.render("comments_edit", {trail, comment});
	} catch (err) {
		res.send("Error - comments.js edit")
	}
})


router.put("/:commentId", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		res.redirect(`/trails/${req.params.id}`);
	} catch (err) {
		res.send("Error - comments.js comment put")
	}
})

router.delete("/:commentId", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		res.redirect(`/trails/${req.params.id}`)
	} catch (err) {
		res.send("Error = comments.js comment delete")
	}
})

module.exports = router;
