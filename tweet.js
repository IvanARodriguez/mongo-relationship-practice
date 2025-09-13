const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relations');

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'database connection error'));

database.once('open', () => console.log('Database connected'));

const userSchema = new mongoose.Schema({
	username: String,
	dob: Date,
});

const tweetSchema = new mongoose.Schema({
	text: String,
	likes: Number,
	user: { type: mongoose.Types.ObjectId, ref: 'TweetUser' },
});

const TweetUser = mongoose.model('TweetUser', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

async function makeTweets() {
	try {
		// Flush the data first
		await TweetUser.deleteMany({});
		await Tweet.deleteMany({});

		// Create a new User
		const user = new TweetUser({
			username: 'JohnDoe',
			dob: new Date(1991, 6, 31),
		});

		const firstTweet = new Tweet({
			text: 'This is john doe programmer first tweet',
			likes: 1345,
		});

		const secondTweet = new Tweet({
			text: 'Today I am learning Python',
			likes: 0,
		});

		firstTweet.user = user;
		secondTweet.user = user;

		await user.save();
		await secondTweet.save();
		await firstTweet.save();
	} catch (error) {
		console.log('Error creating user with tweet: ', error);
	}
}

async function showTweets() {
	return await Tweet.find({}).populate('user', 'username');
}

makeTweets()
	.then(() => showTweets().then((t) => console.log(t)))
	.finally(() => database.close());
