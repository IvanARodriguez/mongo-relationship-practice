const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relations');

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'database connection error'));

database.once('open', () => console.log('Database connected'));

async function seedProduct() {
	const productSchema = new mongoose.Schema({
		name: String,
		price: Number,
		season: {
			type: String,
			enum: ['Spring', 'Summer', 'Fall', 'Winter'],
		},
	});

	const Product = mongoose.model('Product', productSchema);

	await Product.insertMany([
		{ name: 'Goddess Melon', price: 4.99, season: 'Summer' },
		{ name: 'Sugar Baby Watermelon', price: 4.99, season: 'Winter' },
		{ name: 'Asparagus', price: 2.99, season: 'Spring' },
	]);
}

seedProduct().then(() => {
	database.close();
});
