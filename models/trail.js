const mongoose = require("mongoose");

const trailSchema = new mongoose.Schema({
	title: String,
	description: String,
	location: String,
	difficulty: String,
	landscape: String,
	date: String,
	image: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String]
})

trailSchema.index({
	'$**': 'text'
})

module.exports = mongoose.model("trail", trailSchema);