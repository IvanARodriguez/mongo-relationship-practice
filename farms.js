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

const farmSchema = new mongoose.Schema({
	name: String,
	city: String,
	products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
});

const Product = mongoose.model('Product', productSchema);

const Farm = mongoose.model('Farm', farmSchema);

// Practice One-to-Many Relationships with References
async function seedProduct() {
	try {
		// Delete all record to avoid duplicates
		await Farm.deleteMany({});
		await Product.deleteMany({});
		await Product.insertMany([
			{ name: 'Goddess Melon', price: 4.99, season: 'Summer' },
			{ name: 'Sugar Baby Watermelon', price: 4.99, season: 'Winter' },
			{ name: 'Asparagus', price: 2.99, season: 'Spring' },
		]);

		// Create a Farm and associate a product with it
		const farm = new Farm({ name: 'TriTon Farms', city: 'Tampa, FL' });
		const watermelon = await Product.findOne({ name: 'Sugar Baby Watermelon' });
		farm.products.push(watermelon);
		await farm.save();

		// Find the farm and populate its products
		await Farm.findOne({ name: 'TriTon Farms' })
			.populate('products')
			.then((farm) => console.log(farm));

		console.log('Products seeded!');
	} catch (error) {
		console.error('Seeding error:', error);
	}
}

seedProduct().then(() => {
	database.close();
});
