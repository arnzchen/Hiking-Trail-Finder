const Trail = require("../models/trail");

const checkTrailOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {
		const trail = await Trail.findById(req.params.id).exec();
		if (trail.owner.id.equals(req.user._id)) {
			next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	} else {
		req.flash("error", "You don't have permission to do that")
		res.redirect("/login");
	}
}

module.exports = checkTrailOwner;