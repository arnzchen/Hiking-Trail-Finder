const Trail = require("../models/trail");

const checkTrailOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {
		const trail = await Trail.findById(req.params.id).exec();
		if (trail.owner.id.equals(req.user._id)) {
			next();
		} else {
			res.redirect("back");
		}
	} else {
		res.redirect("/login");
	}
}

module.exports = checkTrailOwner;