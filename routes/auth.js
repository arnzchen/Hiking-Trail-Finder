const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//Sign Up - New
router.get('/signup', (req, res) => {
	res.render('signup');
});

//Sign Up - Create
router.post('/signup', async (req, res) => {
	try {
		const newUser = await User.register(new User({
			username: req.body.username,
			email: req.body.email
		}), req.body.password);
		req.flash("success", `Signed you up as ${newUser.username}!`);
		passport.authenticate('local')(req, res, () => {
			res.redirect('/trails');
		})
	} catch (err) {
		console.log(err);
		req.flash("error", "That user already exists!")
		res.redirect('/signup');
	}
});

//Login - Show Form
router.get("/login", (req, res) => {
	res.render('login', {message: req.flash("error")});
});

//Login
router.post("/login", passport.authenticate('local', {
	successRedirect: "/trails",
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: "Logged in successfully!"
}));

//Logout
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged out!")
	res.redirect('/trails');
})

module.exports = router;