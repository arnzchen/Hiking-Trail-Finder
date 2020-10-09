const Trail = require("../models/trail");
const Comment = require("../models/comment");


//data
const trail_seeds = [
	{
		title: "Trolltunga",
		description: "Trolltunga is one of Norway’s most popular hikes for good reason. It is an incredibly scenic hike, ending at the Troll’s tongue, a thin sliver of rock perfect for creative photographs. This is definitely a hike to add to your bucket list. For us, the hike to Trolltunga was our third of four hikes in Norway. Kjeragbolten was our favorite, but this hike was not far behind. The scenery along the hike is phenomenal with views out over lakes and snow capped mountains, and posing on Trolltunga for photos is a blast.",
		location: "Trolltunga, Norway",
		difficulty: "advanced",
		landscape: "mountains",
		date: "2020-09-02",
		image: "https://s27363.pcdn.co/wp-content/uploads/2020/05/Trolltunga-Norway.jpg.optimal.jpg"
	},
	{
		title: "The Enchantments",
		description: "The Enchantments are a part of the Alpine Lakes Wilderness, (which is itself a part of the Wenatchee National Forest) located near the town of Leavenworth, along Highway 2, in Washington State. The Enchantments area is actually very small, making up maybe 10 square miles. Packed in to this wondrous world there are scads of small lakes and tarns of fantastic hues of blue and green surrounded by stark jagged peaks. Autumn brings fantastic colors. Because of the high elevation of the Enchantments Basin (between 7,000 and 8,000 feet) there are dense stands of larch. These trees have needles, and come fall they turn a bright orange color, and look like they are aglow from inside.",
		location: "Leavenworth, WA",
		difficulty: "moderate",
		landscape: "lakes",
		date: "2020-10-02",
		image: "https://andyporterimages.com/wp-content/uploads/2015/02/On_the_Trail_to_Perfection_Lake-1024x683.jpg"
	},
	{
		title: "Charlies Bunion",
		description: "Great Smoky Mountains National Park in Tennessee and North Carolina is world-renowned for its diversity of plant and animal life and sprawling mountains to hike and explore. The park even has a “Hike the Smokies” challenge, which rewards hikers who have explored 100+ miles of the park with exclusive mileage pins. The park has miles of official and backcountry trails with views of waterfalls and old-growth forests. Take the hike to Charlies Bunion via the Appalachian Trail for beautiful views of the mountains and forest.",
		location: "Newfound Gap, TN",
		difficulty: "moderate",
		landscape: "forests",
		date: "2020-11-02",
		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2017%2F04%2F16-great-smoky-mountains-national-park-BESTHIKE0407.jpg"
	}
];


const seed = async () => {
	await Trail.deleteMany();
	await Comment.deleteMany();
	
	// for (const trail_seed of trail_seeds) {
	// 	let trail = await Trail.create(trail_seed);
	// 	await Comment.create({
	// 		text: "I loved this Hike!",
	// 		user: "Hunter Wilks",
	// 		trailId: trail._id
	// 	})
	// }
}

module.exports = seed;