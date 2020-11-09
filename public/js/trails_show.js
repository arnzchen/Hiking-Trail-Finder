const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");

const sendVote = async (voteType) => {
	// fetch options
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		}
	}
	if (voteType === "up") {
		options.body = JSON.stringify({
			voteType: "up",
			trailId
		})
	} else if (voteType === "down") {
		options.body = JSON.stringify({
			voteType: "down",
			trailId
		})
	} else {
		throw "voteType must be 'up' or 'down'"
	}
	
	// send fetch req
	await fetch("/trails/vote", options)
	.then(data => {
		return data.json();
	})
	.then(res => {
		console.log(res);
	})
	.catch(err => {
		console.log(err);
	})
}

upvoteBtn.addEventListener("click", async function() {
	sendVote("up");
});

downvoteBtn.addEventListener("click", async function() {
	sendVote("down");
});

