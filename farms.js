const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relations');

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'database connection error'));

database.once('open', () => console.log('Database connected'));

const productSchema = new mongoose.Schema({
	name: String,
	price: Number,
	season: {
		type: String,
		enum: ['Spring', 'Summer', 'Fall', 'Winter'],
	},
});

const Product = mongoose.model('Product', productSchema);

async function seedProduct() {
	try {
		await Product.deleteMany({});
		await Product.insertMany([
			{ name: 'Goddess Melon', price: 4.99, season: 'Summer' },
			{ name: 'Sugar Baby Watermelon', price: 4.99, season: 'Winter' },
			{ name: 'Asparagus', price: 2.99, season: 'Spring' },
		]);
		console.log('Products seeded!');
	} catch (error) {
		console.error('Seeding error:', err);
	}
}

seedProduct().then(() => {
	database.close();
});
