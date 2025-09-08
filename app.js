const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relations');

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'database connection error'));

database.once('open', () => console.log('Database connected'));

const AddressesSchema = [
	{
		street: String,
		city: String,
		state: String,
		country: String,
	},
];

const userSchema = new mongoose.Schema({
	first: String,
	last: String,
	addresses: AddressesSchema,
});

const User = mongoose.model('User', userSchema);

async function makeUser() {
	const u = new User({
		first: 'Harry',
		last: 'Potter',
	});

	u.addresses.push({
		street: '123 Main Street',
		city: 'Orlando',
		state: 'FL',
		country: 'USA',
	});
	u.addresses.push({
		street: '7 Sesame St.',
		city: 'Orlando',
		state: 'FL',
		country: 'USA',
	});

	await u.save();
}

makeUser();
