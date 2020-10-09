//npm
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require("morgan");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

//config
const config = require('./config');


//route imports
const landing = require("./routes/main");
const trailRoutes = require("./routes/trails");
const trailComments = require("./routes/comments");
const authRoutes = require("./routes/auth");

//models
const Trail = require("./models/trail");
const Comment = require("./models/comment");
const User = require('./models/user');



mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});



app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(expressSession({
	secret:"wadawdawdawdawdgargqe",
	resave: false,
	saveUninitialized: false
}))

app.use(morgan('tiny'));

//seed the database
// const seed = require("./utils/seed");
// seed();


app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Current user Config
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
})

// Route Config
app.use("/", landing);
app.use("/", authRoutes);
app.use("/trails", trailRoutes);
app.use("/trails/:id/comments", trailComments);



app.listen(3000, () => {
	console.log("Hiking Trails Finder is running...");
})
