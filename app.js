//npm
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require("morgan");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

//config
try {
	var config = require('./config');
} catch (err) {
	console.log("Could not import config, probably not working locally");
	console.log(err);
}


//route imports
const landing = require("./routes/main");
const trailRoutes = require("./routes/trails");
const trailComments = require("./routes/comments");
const authRoutes = require("./routes/auth");

//models
const Trail = require("./models/trail");
const Comment = require("./models/comment");
const User = require('./models/user');


// mongoose config
try {
	mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
} catch (err) {
	console.log("could not connect using config, probably not working locally");
	console.log(process.env);
	mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}


// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({
	type: ['application/json', 'text/plain']
}));

// Express Session Config
app.use(expressSession({
	secret: process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitialized: false
}))

app.use(morgan('tiny'));


// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Connect Flash
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// State Config
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})

// Route Config
app.use("/", landing);
app.use("/", authRoutes);
app.use("/trails", trailRoutes);
app.use("/trails/:id/comments", trailComments);



app.listen(process.env.PORT || 3000, () => {
	console.log("Hiking Trails Finder is running...");
})
