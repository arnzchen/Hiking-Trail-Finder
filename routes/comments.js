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
	req.flash("success", "Comment created!");
	res.redirect(`/trails/${req.body.trailId}`);
	} catch (err) {
		req.flash("error", "Error creating comment");
		res.redirect("/trails");
	}
})

// Edit Comment 
router.get("/:commentId/edit", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const trail = await Trail.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		res.render("comments_edit", {trail, comment});
	} catch (err) {
		console.log(err);
		res.redirect("/trails");
	}
})

// Update Comment
router.put("/:commentId", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		req.flash("success", "Comment updated successfully!");
		res.redirect(`/trails/${req.params.id}`);
	} catch (err) {
		req.flash("error", "Error updating comment");
		res.redirect("/trails");
	}
})

// Delete Comment
router.delete("/:commentId", isLoggedIn, checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		req.flash("success", "Comment deleted successfully");
		res.redirect(`/trails/${req.params.id}`);
	} catch (err) {
		req.flash("error", "Error deleting comment");
		res.redirect("/trails");
	}
})

module.exports = router;
